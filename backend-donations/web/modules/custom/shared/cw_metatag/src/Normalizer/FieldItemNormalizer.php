<?php

namespace Drupal\cw_metatag\Normalizer;

use Drupal\serialization\Normalizer\NormalizerBase;
use Drupal\jsonapi\Normalizer\Value\FieldItemNormalizerValue;

/**
 * Overrides default Normalizer to convert the Metatag field item object structure to METATAG array structure.
 */
class FieldItemNormalizer extends NormalizerBase {

  /**
   * The interface or class that this Normalizer supports.
   *
   * @var string
   */
  protected $supportedInterfaceOrClass = 'Drupal\metatag\Plugin\Field\FieldType\MetatagFieldItem';

  /**
   * Overrides default Normalizer to output Metatag field values as array.
   */
  public function normalize($field_item, $format = null, array $context = array()) {
    $values = [];
    foreach ($field_item as $property_name => $property) {
      $values[$property_name] = $property->getValue();
    }

    return new FieldItemNormalizerValue($values);
  }

}
