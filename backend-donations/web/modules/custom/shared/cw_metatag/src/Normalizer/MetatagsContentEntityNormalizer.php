<?php

namespace Drupal\cw_metatag\Normalizer;

use Drupal\jsonapi\ResourceType\ResourceType;
use Drupal\jsonapi\Normalizer\ContentEntityNormalizer;

class MetatagsContentEntityNormalizer extends ContentEntityNormalizer {

  /**
   * The interface or class that this Normalizer supports.
   *
   * @var string
   */
  protected $supportedInterfaceOrClass = 'Drupal\commerce_product\Entity\ProductInterface';

  /**
   * {@inheritdoc}
   *
   * Prepare metatags to show in jsonapi.
   */
  protected function getFields($entity, $bundle, ResourceType $resource_type) {
    $metatags_field_name = 'field_metatags';

    if ($entity->hasField($metatags_field_name)) {
      $metatags = $entity->get($metatags_field_name)->getValue();

      // Output default metatags if field doesn't have value and don't execute this code again.
      if (empty($metatags[0]['value']) || !is_array($metatags[0]['value'])) {
        // Prepare metatags for entity.
        $metatag_manager = \Drupal::service('metatag.manager');
        $tags = $metatag_manager->tagsFromEntityWithDefaults($entity);
        $tags_array = $metatag_manager->generateRawElements($tags, $entity);

        // Normalize array with metatags (remove # symbol from properties names).
        $metatag_normalized = [];
        foreach ($tags_array as $tag_name => $tags_item) {
          foreach ($tags_item as $key => $tag_value) {
            $normalized_key = str_replace('#', '', $key);
            $metatag_normalized[$tag_name][$normalized_key] = $tag_value;
          }
        }

        $entity->set($metatags_field_name, ['value' => $metatag_normalized]);
      }
    }
    return parent::getFields($entity, $bundle, $resource_type);
  }
}
