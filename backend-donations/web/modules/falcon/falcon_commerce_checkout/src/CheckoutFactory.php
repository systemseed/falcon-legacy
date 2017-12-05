<?php
namespace Drupal\falcon_commerce_checkout;

/**
 *
 */
abstract class CheckoutFactory {

  /**
   * Returns CheckoutBase child class by given service type.
   *
   * @param string $serviceType
   *   Type of service: gifts, syc, cw, etc.
   * @param array $paymentData
   *   An array of payment data given from front end.
   *
   * @return CheckoutBase
   */
  public static function createCheckout($serviceType, $paymentData) {
    return new CheckoutGifts($paymentData);
  }
}
