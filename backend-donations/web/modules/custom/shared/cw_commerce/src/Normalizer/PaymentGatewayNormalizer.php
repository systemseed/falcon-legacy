<?php

namespace Drupal\cw_commerce\Normalizer;

use Drupal\jsonapi\ResourceType\ResourceType;
use Drupal\commerce_payment\Entity\PaymentGateway;
use Drupal\jsonapi\Normalizer\ConfigEntityNormalizer;

/**
 * Custom normalizer to remove sensitive payment gateway data from API output.
 *
 * @package Drupal\cw_commerce\Normalizer
 */
class PaymentGatewayNormalizer extends ConfigEntityNormalizer {

  /**
   * {@inheritdoc}
   */
  public function supportsNormalization($data, $format = NULL) {

    if (parent::supportsNormalization($data, $format)) {
      if ($data instanceof PaymentGateway) {
        return TRUE;
      }
    }

    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  protected function getFields($entity, $bundle, ResourceType $resource_type) {
    $fields = parent::getFields($entity, $bundle, $resource_type);

    // Remove sensitive payment data from JSON API output.
    if ($fields['plugin'] == 'paypal_button') {
      unset($fields['configuration']['secret_key']);
    }

    if ($fields['plugin'] == 'stripe') {
      unset($fields['configuration']['secret_key_test'], $fields['configuration']['secret_key']);
    }

    return $fields;

  }

}
