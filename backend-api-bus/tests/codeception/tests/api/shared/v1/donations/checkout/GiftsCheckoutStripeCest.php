<?php
namespace shared\v1\donations\checkout;

use Codeception\Util\HttpCode;
use Step\Api\DonationsGiftsTester;

/**
 * Class GiftsCheckoutStripeCest
 *
 * Test checkout endpoint with Stripe payment data.
 *
 * @package shared\v1\donations\checkout
 */
class GiftsCheckoutStripeCest {

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
   * Send valid checkout request with valid Stripe token.
   *
   * @param \Step\Api\DonationsGiftsTester $I
   */
  public function giftCheckoutStripeEUR(DonationsGiftsTester $I) {
    $this->giftCheckoutStripe($I, 'EUR');
  }

  /**
   * Send valid checkout request with INVALID Stripe token.
   *
   * @param \Step\Api\DonationsGiftsTester $I
   */
  public function giftCheckoutStripeInvalidEUR(DonationsGiftsTester $I) {
    $this->giftCheckoutStripeInvalid($I, 'EUR');
  }

  /**
   * Send valid checkout request with valid Stripe token.
   *
   * @param \Step\Api\DonationsGiftsTester $I
   */
  public function giftCheckoutStripeGBP(DonationsGiftsTester $I) {
    $this->giftCheckoutStripe($I, 'GBP');
  }

  /**
   * Send valid checkout request with INVALID Stripe token.
   *
   * @param \Step\Api\DonationsGiftsTester $I
   */
  public function giftCheckoutStripeInvalidGBP(DonationsGiftsTester $I) {
    $this->giftCheckoutStripeInvalid($I, 'GBP');
  }

  /**
   * Helper method to send checkout request with Stripe payment data.
   *
   * @param \Step\Api\DonationsGiftsTester $I
   * @param $currency
   */
  private function giftCheckoutStripe(DonationsGiftsTester $I, $currency) {
    $checkoutRequest = $this->checkputRequest;
    $checkoutRequest['payment']['currency'] = $currency;

    // Get valid event code.
    $checkoutRequest['order_fields']['field_event_code'] = $I->getEventCodeId();

    // Generate test frontend token.
    $checkoutRequest['payment']['stripe_token'] = $I->getStipeToken();

    $I->amGoingTo('Send POST request to /v1/donations/cw/checkout/gifts.');

    $I->haveHttpHeader('Content-Type', 'application/json');
    $I->sendPOST('/v1/donations/cw/checkout/gifts?_format=json', $checkoutRequest);

    $I->expectTo('See JSON response with 200 OK.');

    $I->seeResponseCodeIs(HttpCode::OK);

    $I->expectTo('See order id, uuid and completed status in the response.');
    $I->seeResponseContainsJson(['order_status' => 'completed']);
    $I->seeResponseJsonMatchesJsonPath('$.data.order_id');
    $I->seeResponseJsonMatchesJsonPath('$.data.order_uuid');

    $I->getOrderData($I->grabDataFromResponseByJsonPath('$.data.order_uuid')[0]);

    $I->amGoingTo('Check order total amount.');
    $I->seeResponseContainsJson([
      'total_price' => [
        // NOTE: for now, total is fixed: 13.50 + 100.
        'number' => '113.500000',
        'currency_code' => $currency,
      ]
    ]);

    $I->amGoingTo('Check profile data.');
    $profile_data = $this->checkputRequest['profile'];
    unset($profile_data['field_profile_address'], $profile_data['email']);

    $I->seeResponseContainsJson($profile_data);
  }

  /**
   * Helper method to send checkout request with INVALID payment data.
   *
   * @param \Step\Api\DonationsGiftsTester $I
   * @param $currency
   */
  private function giftCheckoutStripeInvalid(DonationsGiftsTester $I, $currency) {
    $checkoutRequest = $this->checkputRequest;
    $checkoutRequest['payment']['currency'] = $currency;

    // Get valid event code.
    $checkoutRequest['order_fields']['field_event_code'] = $I->getEventCodeId();

    // Generate test frontend token.
    $checkoutRequest['payment']['stripe_token'] = 'invalid_token';

    $I->amGoingTo('Send POST request to /v1/donations/cw/checkout/gifts.');
    $I->haveHttpHeader('Content-Type', 'application/json');
    $I->sendPOST('/v1/donations/cw/checkout/gifts?_format=json', $checkoutRequest);

    $I->expectTo('See JSON response with 500.');

    $I->seeResponseCodeIs(HttpCode::INTERNAL_SERVER_ERROR);
  }
}
