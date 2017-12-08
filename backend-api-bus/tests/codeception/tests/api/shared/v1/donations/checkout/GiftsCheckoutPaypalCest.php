<?php

namespace shared\v1\donations\checkout;

use Codeception\Util\HttpCode;
use Step\Api\DonationsGiftsTester;

/**
 * Class GiftsCheckoutPaypalCest
 *
 * Test checkout endpoint with (fake) Paypal payment data.
 *
 * @package shared\v1\donations\checkout
 */
class GiftsCheckoutPaypalCest {

  // Valid request with two items of test product.
  public $checkputRequest = array (
    'profile' =>
      array (
        'field_profile_first_name' => 'Test',
        'field_profile_last_name' => 'Suite',
        'field_profile_email' => 'test-GiftsCheckoutPaypalCest@systemseed.com',
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
        'email' => 'test-GiftsCheckoutPaypalCest@systemseed.com',
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
            'quantity' => 2,
          ),
      ),
    'payment' =>
      array (
        // NOTE: there is no way to get payerID from backend code.
        'payerID' => 'TESTSUITE',
        'paymentID' => '',
        'type' => 'commerce_payment_gateway--commerce_payment_gateway',
        'id' => 'gifts_test_paypal',
        'uuid' => 'fb37c33f-1579-4285-9ea6-d7f8ac19ca4e',
        'status' => TRUE,
        'label' => 'gifts_test_paypal',
        'weight' => NULL,
        'plugin' => 'paypal_button',
        'configuration' =>
          array (
            'client_id' => '', // @todo paste test Paypal client_id.
            'mode' => 'test',
            'payment_method_types' =>
              array (
                0 => 'paypal',
              ),
          ),
        'currency' => '',
      ),
  );

  /**
   * Send valid checkout request with valid Paypal payment.
   *
   * @param \Step\Api\DonationsGiftsTester $I
   */
  public function giftCheckoutPaypalEUR(DonationsGiftsTester $I) {
    $this->giftCheckoutPaypal($I, 'EUR');
  }

  /**
   * Send valid checkout request with INVALID Paypal payment.
   *
   * @param \Step\Api\DonationsGiftsTester $I
   */
  public function giftCheckoutPaypalInvalidEUR(DonationsGiftsTester $I) {
    $this->giftCheckoutPaypalInvalid($I, 'EUR');
  }

  /**
   * Send valid checkout request with valid Paypal payment.
   *
   * @param \Step\Api\DonationsGiftsTester $I
   */
  public function giftCheckoutPaypalGBP(DonationsGiftsTester $I) {
    $this->giftCheckoutPaypal($I, 'GBP');
  }

  /**
   * Send valid checkout request with INVALID Paypal payment.
   *
   * @param \Step\Api\DonationsGiftsTester $I
   */
  public function giftCheckoutPaypalInvalidGBP(DonationsGiftsTester $I) {
    $this->giftCheckoutPaypalInvalid($I, 'GBP');
  }

  /**
   * Helper method to send checkout request with Paypal payment data.
   *
   * @param \Step\Api\DonationsGiftsTester $I
   * @param $currency
   */
  private function giftCheckoutPaypal(DonationsGiftsTester $I, $currency) {
    $checkoutRequest = $this->checkputRequest;
    $checkoutRequest['payment']['currency'] = $currency;

    // Get valid event code.
    $checkoutRequest['order_fields']['field_event_code'] = $I->getEventCodeId();

    // Create paypal payment.
    $checkoutRequest['payment']['paymentID'] = $I->makeFakePaypalPayment(13.50 * 2, $currency);

    $I->amGoingTo('Send POST request to /v1/donations/falcon/checkout/gifts.');

    $I->haveHttpHeader('Content-Type', 'application/json');
    $I->sendPOST('/v1/donations/falcon/checkout/gifts?_format=json', $checkoutRequest);

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
        // NOTE: for now, total is fixed: 13.50 * 2.
        'number' => '27.000000',
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
  private function giftCheckoutPaypalInvalid(DonationsGiftsTester $I, $currency) {
    $checkoutRequest = $this->checkputRequest;
    $checkoutRequest['payment']['currency'] = $currency;

    // Get valid event code.
    $checkoutRequest['order_fields']['field_event_code'] = $I->getEventCodeId();

    // Create INVALID paypal payment.
    $checkoutRequest['payment']['paymentID'] = 'PAY-INVALID';

    $I->amGoingTo('Send POST request to /v1/donations/falcon/checkout/gifts.');

    $I->haveHttpHeader('Content-Type', 'application/json');
    $I->sendPOST('/v1/donations/falcon/checkout/gifts?_format=json', $checkoutRequest);

    $I->expectTo('See JSON response with 500.');

    $I->seeResponseCodeIs(HttpCode::INTERNAL_SERVER_ERROR);
  }
}
