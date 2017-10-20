<?php

namespace Drupal\cw_commerce_checkout;

use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Interface CheckoutInterface.
 *
 * @package Drupal\cw_commerce_checkout
 */
interface CheckoutInterface {

  /**
   * Execute checkout process.
   *
   * It creates user or load existing, creates profile with given params,
   * creates order in draft status, process payment with given payment gateway and
   * complete order if payment ok. Returns created order data or error.
   *
   * @return JsonResponse
   *   Checkout response.
   */
  public function processCheckout();
}
