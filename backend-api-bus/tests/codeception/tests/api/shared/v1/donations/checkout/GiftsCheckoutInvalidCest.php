<?php
namespace shared\v1\donations\checkout;

use Codeception\Util\HttpCode;
use Step\Api\DonationsGiftsTester;

class GiftsCheckoutInvalidCest {

  // Valid request with one test product and custom donation.
  public $checkputRequest = array (
    'profile' =>
      array (
        'field_profile_first_name' => 'Test',
        'field_profile_last_name' => 'Suite',
        'field_profile_email' => 'test-GiftsCheckoutStripeCest@systemseed.com',
        'field_profile_phone' => '123456789',
        'field_profile_prefs_sms' => '1',
        'field_profile_prefs_phone' => '1',
        'field_profile_prefs_post' => '0',
        'field_profile_prefs_email' => '1',
        'field_profile_address' =>
          array (
            'address_line1' => 'Address 1',
            'address_line2' => 'Address 2',
            'locality' => 'Dublin',
            'administrative_area' => 'Co. Dublin',
            'country_code' => 'IE',
          ),
        'email' => 'test-GiftsCheckoutStripeCest@systemseed.com',
      ),
    'order_fields' =>
      array (
        'field_event_code' => '',
      ),
    'order_items' =>
      array (
        0 =>
          array (
            'id' => '496b7eb0-27d6-45ee-a396-3de4e350efa0',
            'type' => 'gift',
            'title' => 'Koala (Test Suite)',
            'variantType' => 'normal',
            'price' =>
              array (
                'EUR' =>
                  array (
                    'variation_id' => '23',
                    'sku' => 'koala-testsuite',
                    'amount' => '13.500000',
                    'currency' => 'EUR',
                  ),
                'GBP' =>
                  array (
                    'variation_id' => '25',
                    'sku' => 'koala-testsuite-gb',
                    'amount' => '13.500000',
                    'currency' => 'GBP',
                  ),
              ),
            'quantity' => 1,
          ),
        1 =>
          array (
            'id' => '7e39242c-b1f5-4159-b47c-d00c57032892',
            'type' => 'gift',
            'title' => 'Custom donation',
            'variantType' => 'custom_price',
            'price' =>
              array (
                'variation_id' => '11',
                'sku' => 'custom-donation',
                'amount' => 100,
              ),
            'quantity' => 1,
          ),
      ),
    'payment' =>
      array (
        'type' => 'commerce_payment_gateway--commerce_payment_gateway',
        'id' => 'gifts_test_stripe',
        'uuid' => 'b3463cea-fabe-42d2-8fc1-1f7ee201a2ca',
        'langcode' => 'en',
        'status' => TRUE,
        'label' => 'Gifts Test Stripe',
        'weight' => -9,
        'plugin' => 'stripe',
        'configuration' =>
          array (
            'mode' => 'test',
            'payment_method_types' =>
              array (
                0 => 'credit_card',
              ),
          ),
        'stripe_token' => '',
        'currency' => '',
      ),
  );

  /**
   * Send checkout request with empty profile data.
   *
   * @param \Step\Api\DonationsGiftsTester $I
   */
  public function giftCheckoutInvalidProfileEUR(DonationsGiftsTester $I) {
    $checkoutRequest = $this->checkputRequest;
    // Get valid event code.
    $checkoutRequest['order_fields']['field_event_code'] = $I->getEventCodeId();

    $I->amGoingTo('Send checkout request with empty profile fields');
    foreach ($checkoutRequest['profile'] as $key => $value) {
      $checkoutRequest['profile'][$key] = '';
    }

    $this->giftCheckoutInvalid($I, $checkoutRequest, 'EUR');
  }

  /**
   * Send checkout request with empty order items.
   *
   * @param \Step\Api\DonationsGiftsTester $I
   */
  public function giftCheckoutInvalidOrderItemsEUR(DonationsGiftsTester $I) {
    $checkoutRequest = $this->checkputRequest;
    // Get valid event code.
    $checkoutRequest['order_fields']['field_event_code'] = $I->getEventCodeId();

    $I->amGoingTo('Send checkout request with empty profile fields');
    unset($checkoutRequest['order_items']);

    $this->giftCheckoutInvalid($I, $checkoutRequest, 'EUR');
  }

  /**
   * Helper to send checkout data.
   *
   * @param \Step\Api\DonationsGiftsTester $I
   * @param $checkoutRequest
   * @param $currency
   */
  private function giftCheckoutInvalid(DonationsGiftsTester $I, $checkoutRequest, $currency) {
    $checkoutRequest['payment']['currency'] = $currency;

    // Generate test payment token to see validation fails NOT because of
    // invalid payment.
    $checkoutRequest['payment']['stripe_token'] = $I->getStipeToken();

    $I->amGoingTo('Send POST request to /v1/donations/falcon/checkout/gifts.');

    $I->haveHttpHeader('Content-Type', 'application/json');
    $I->sendPOST('/v1/donations/falcon/checkout/gifts?_format=json', $checkoutRequest);

    $I->expectTo('See JSON response with 500.');

    $I->seeResponseCodeIs(HttpCode::INTERNAL_SERVER_ERROR);
  }

}
