<?php

namespace Drupal\cw_commerce_checkout\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\cw_commerce_checkout\CheckoutFactory;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class CheckoutController.
 *
 * @package Drupal\cw_commerce_checkout\Controller
 */
class CheckoutController extends ControllerBase {

  /**
   * Process checkout API request.
   *
   * @param string $serviceType
   *   Type of service: gifts, syc, cw, etc.
   * @param Request $request
   *   Incoming request object.
   *
   * @return JsonResponse
   *   Checkout response.
   */
  function post($serviceType, Request $request) {
    $data = [];
    if ($request->headers->get('Content-Type') == 'application/json') {
      $data = json_decode($request->getContent(), TRUE);
    }

    // Creates Checkout object and process the checkout.
    $checkout = CheckoutFactory::createCheckout($serviceType, $data);
    return $checkout->processCheckout();
  }

  /**
   * @todo: add example of request to Readme.io.
   */
  function debug() {
    $serviceType = 'gifts';
    $data = [
      'order_items' => [
        // Custom price product has customPrice property filled.
        0 => [
          'id' => '7bbf9d67-ebde-481c-b1b7-b2336cbc7127',
          'quantity' => 1,
          'type' => 'gift_corporate',
          'title' => 'Additional Donation',
          'customPrice' => [
            'amount' => 19,
            'sku' => 'customprice',
            'variation_id' => '11',
          ],
          'priceByCurrency' => [],
          'variantType' => 'custom_price'
        ],
        // Normal product has priceByCurrency property filled.
        1 => [
          'id' => '2bbf9d67-ebde-481c-b1b7-b2336cbc7127',
          'quantity' => 1,
          'type' => 'gift_corporate',
          'title' => 'Normal gift',
          'customPrice' => [],
          'priceByCurrency' => [
            'EUR' => [
              'amount' => 2,
              'sku' => 'normal',
              'variation_id' => '5',
            ],
          ],
          'variantType' => 'normal'
        ],
      ],
      'profile' => [
        'email' => 'falcon.customer-test@systemseed.com',
        'field_profile_email' => 'falcon.customer-test@systemseed.com',
        'field_profile_first_name' => 'Nike',
        'field_profile_last_name' => 'Nicolas'
      ],
      'order_fields' => [
        'field_event_code' => '2'
      ],
      'payment' => [
        'stripe_token' => 'aaaaa',
        'currency' => 'EUR',
        'id' => 'gifts_test_stripe',
        'plugin' => 'stripe',
        'configuration' => [
          'publishable_key_test' => '', // @todo: use real test stripe key here.
          'payment_method_types' => [
            0 => 'credit_card'
          ]
        ],
      ],
    ];
    $checkout = CheckoutFactory::createCheckout($serviceType, $data);
    $checkout->processCheckout();
    return ['#markup' => 'Debug checkout'];
  }
}
