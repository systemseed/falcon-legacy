<?php

namespace Drupal\falcon_metatag\Normalizer;

use Drupal\jsonapi\ResourceType\ResourceType;
use Drupal\jsonapi\Normalizer\ConfigEntityNormalizer;

/**
 * Custom normalizer to remove sensitive payment gateway data from API output.
 *
 * @package Drupal\falcon_metatag\Normalizer
 */
class MetatagsConfigEntityNormalizer extends ConfigEntityNormalizer {

  /**
   * The interface or class that this Normalizer supports.
   *
   * @var string
   */
  protected $supportedInterfaceOrClass = 'Drupal\metatag\MetatagDefaultsInterface';

  /**
   * {@inheritdoc}
   *
   * Prepare metatags to show in jsonapi.
   */
  protected function getFields($entity, $bundle, ResourceType $resource_type) {
    if ($bundle == 'metatag_defaults') {
      if (empty($entity->metatag_normalized)) {
        // Prepare metatags for entity.
        $metatag_manager = \Drupal::service('metatag.manager');
        $global_tags =  $metatag_manager->getGlobalMetatags();
        $tags_array = $metatag_manager->generateRawElements(array_merge($global_tags->get('tags'), $entity->get('tags')));

        // Normalize array with metatags (remove # symbol from properties names).
        $metatag_normalized = [];
        foreach ($tags_array as $tag_name => $tags_item) {
          foreach ($tags_item as $key => $tag_value) {
            $normalized_key = str_replace('#', '', $key);
            $metatag_normalized[$tag_name][$normalized_key] = $tag_value;
          }
        }

        $entity->set('tags', $metatag_normalized);
        $entity->set('metatag_normalized', true);
      }
      return parent::getFields($entity, $bundle, $resource_type);
    }
  }

}
