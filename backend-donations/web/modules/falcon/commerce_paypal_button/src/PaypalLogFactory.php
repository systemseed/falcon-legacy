<?php
namespace Drupal\commerce_paypal_button;

use \PayPal\Log\PayPalLogFactory as PayPalLogFactoryInterface;

/**
 * Class PaypalLogFactory.
 *
 * Set up Drupal logger as a logger for PayPal SDK.
 */
class PaypalLogFactory implements PayPalLogFactoryInterface {

  /**
   * @param string $className
   * @return \Psr\Log\LoggerInterface
   */
  public function getLogger($className) {
    return new PaypalLogger();
  }

}
