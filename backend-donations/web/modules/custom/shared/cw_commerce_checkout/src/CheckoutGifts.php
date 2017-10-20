<?php

namespace Drupal\cw_commerce_checkout;


/**
 *
 */
class CheckoutGifts extends CheckoutBase {

  /**
   * CheckoutGifts constructor.
   */
  public function __construct($paymentData) {
    parent::__construct($paymentData);
    $this->profileType = 'profile_gifts';
    $this->orderType = 'gift';
    $this->orderItemType = 'gift';
    $this->profileFields = $paymentData['profile'];
    $this->orderFields = $paymentData['order_fields'];
  }
}
