<?php

namespace Drupal\falcon_multiregion\Plugin\rest\resource;

use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "multiregion",
 *   label = @Translation("Multi-regional settings"),
 *   uri_paths = {
 *     "canonical" = "/falcon/multiregion"
 *   }
 * )
 */
class MultiRegion extends ResourceBase {

  const PAGE_CONFIG_TYPE = 'multi_region_site_settings';
  const COUNTRY_HEADER_NAME = 'X-Forwarded-CF-IPCountry';

  /**
   * A current request object.
   *
   * @var \Symfony\Component\HttpFoundation\Request
   */
  protected $currentRequest;

  /**
   * The 'config_pages' entity storage.
   *
   * @var \Drupal\Core\Entity\$entity_storage
   */
  protected $configPagesStorage;

  /**
   * Constructs a new MultiRegion object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param array $serializer_formats
   *   The available serialization formats.
   * @param \Psr\Log\LoggerInterface $logger
   *   A logger instance.
   * @param \Symfony\Component\HttpFoundation\Request $current_request
   *   The current request.
   * @param \Drupal\Core\Entity\EntityStorageInterface $entity_storage
   *   The entity type manager.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    Request $current_request,
    EntityStorageInterface $entity_storage) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->currentRequest = $current_request;
    $this->configPagesStorage = $entity_storage;

  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('falcon_multiregion'),
      $container->get('request_stack')->getCurrentRequest(),
      $container->get('entity_type.manager')->getStorage('config_pages')
    );
  }

  /**
   * Default multi-regional settings. Everything is turned off.
   *
   * @return array
   */
  private function getDefaultSettings() {
    return [
      'enable_region_switcher' => FALSE,
      'enable_popup' => FALSE,
      'user_suggested_region' => '',
      'regions' => [],
    ];
  }

  private function getRegions($settings) {
    $data = [];

    $regions = $settings->get('field_regions')->referencedEntities();
    foreach ($regions as $region) {
      // All codes should be in uppercase.
      $code = strtoupper($region->get('field_country_code')->getString());

      $image = ['url' => '', 'alt' => ''];
      $file_entities = $region->get('field_image')->referencedEntities();
      if (!empty($file_entities)) {
        $file_entity = array_pop($file_entities);
        $image['url'] = file_create_url($file_entity->getFileUri());
        $image['alt'] = $region->get('field_image')->getValue()[0]['alt'];
      }

      $data[$code] = [
        'code' => $code,
        'title' => $region->get('field_title')->getString(),
        'url' => $region->get('field_region_url')->getString(),
        'image' => $image,
      ];
    }

    return $data;
  }

  /**
   * Return code of suggested region based on user country.
   *
   * At the moment the only implemented way of preferred region is Cloudflare
   * header.
   *
   * @param $settings
   *
   * @return null|string
   */
  private function getSuggestedRegion($settings) {
    // All codes should be in uppercase.
    $code = strtoupper($this->currentRequest->headers->get(self::COUNTRY_HEADER_NAME, ''));
    if (array_key_exists($code, $this->getRegions($settings))) {
      return $code;
    }

    return '';
  }

  /**
   * Prepare response and attach caching dependencies.
   *
   * @param $data
   * @param $config_page_entity
   *
   * @return \Drupal\rest\ResourceResponse
   */
  private function prepareResponse($data, $config_page_entity = NULL) {
    $response = new ResourceResponse($data);

    if ($config_page_entity) {
      $response->addCacheableDependency($config_page_entity);

      if (!empty($data['enable_popup'])) {
        // Vary cache by the proxied country header.
        $build = ['#cache' => ['contexts' => ['headers:'. self::COUNTRY_HEADER_NAME]]];
        $response->addCacheableDependency(CacheableMetadata::createFromRenderArray($build));
      }
    }
    else {
      // Do not cache if config entity was not provided.
      $build = ['#cache' => ['max-age' => 0]];
      $response->addCacheableDependency(CacheableMetadata::createFromRenderArray($build));
    }

    return $response;
  }

  /**
   * Responds to GET requests.
   *
   * @return \Drupal\rest\ResourceResponse
   *   The HTTP response object.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function get() {

    // Load config page entities. There should be one and only one entity.
    $config_pages = $this->configPagesStorage->loadByProperties(['type' => self::PAGE_CONFIG_TYPE]);

    if (!is_array($config_pages) || !count($config_pages)) {
      // Multi-regional settings were not found. Return default settings.
      return $this->prepareResponse($this->getDefaultSettings());
    }

    $settings = array_pop($config_pages);

    $regions = $this->getRegions($settings);
    if (count($regions) < 2) {
      // Not enough regions were configured for multi-regional features.
      // Return default settings.
      return $this->prepareResponse($this->getDefaultSettings(), $settings);
    }
    $data['regions'] = array_values($regions);

    $fields = $settings->getFields(FALSE);
    foreach (array_keys($fields) as $field_name) {
      $field = $fields[$field_name];

      // Regions field was already handled above.
      if ($field_name === 'field_regions') {
        continue;
      }
      // We search only for fields added through UI.
      if (strpos($field_name, 'field_') !== 0) {
        continue;
      }

      $field_name_trimmed = str_replace('field_', '', $field_name);

      switch ($field->getFieldDefinition()->getType()) {
        case 'boolean':
          $data[$field_name_trimmed] = !!$field->value;
          break;
        case 'string':
        case 'text_long':
          if ($field->getFieldDefinition()->getFieldStorageDefinition()->getCardinality() == 1) {
            $data[$field_name_trimmed] = $field->value;
          }
          else {
            foreach ($field->getValue() as $value) {
              $data[$field_name_trimmed][] = $value['value'];
            }
          }
          break;
        default:
          $value = $field->getValue();
          if ($field->getFieldDefinition()->getFieldStorageDefinition()->getCardinality() == 1) {
            if (!empty($value[0])) {
              $data[$field_name_trimmed] = $value[0];
            }
          }
          else {
            foreach ($field->getValue() as $value) {
              $data[$field_name_trimmed][] = $value;
            }
          }
      }
    }

    $data['user_suggested_region'] = $this->getSuggestedRegion($settings);

    return $this->prepareResponse($data, $settings);
  }

}
