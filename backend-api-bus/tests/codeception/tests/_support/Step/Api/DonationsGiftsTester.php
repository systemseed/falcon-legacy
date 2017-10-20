<?php
namespace Step\Api;


use PayPal\Api\Amount;
use PayPal\Api\FundingInstrument;
use PayPal\Api\Payer;
use PayPal\Api\PayerInfo;
use PayPal\Api\Payment;
use PayPal\Api\PaymentCard;
use PayPal\Api\Transaction;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Rest\ApiContext;
use Stripe\Stripe;
use Stripe\Token as StripeToken;

class DonationsGiftsTester extends \ApiTester {

  // @todo: fill in required credentials.
  protected static $stripe_secret_key = '';

  protected static $paypal_client_id = '';
  protected static $paypal_client_secret = '';

  protected static $donations_client_id = '';
  protected static $donations_client_secret = '';

  /**
   * Get any valid event code to use in checkout endpoint.
   *
   * @return string
   *   event code id.
   */
  public function getEventCodeId() {
    $I = $this;

    $I->sendGET('/v1/donations/jsonapi/event_code/event_code', [
      'filter[status][value]' => '1',
      'fields[event_code--event_code]' => 'id',
      'page[limit]' => '1',
    ]);
    $I->canSeeResponseContainsJson(['type' => 'event_code--event_code']);

    return $I->grabDataFromResponseByJsonPath('$.data[0].attributes.id')[0];

  }

  /**
   * Get order from protected JSON API endpoint.
   *
   * @param $order_uuid
   *   Order UUID.
   * @return array
   *   Order data.
   */
  public function getOrderData($order_uuid) {
    $I = $this;

    $I->amGoingTo('Fetch machine Auth token');
    $I->haveHttpHeader('Content-Type', 'application/x-www-form-urlencoded');
    $I->sendPOST('/v1/donations/internal/oauth/token',  [
      'grant_type' => 'client_credentials',
      'client_id' => self::$donations_client_id,
      'client_secret' => self::$donations_client_secret,
      'scope' => 'gifts_manager',
    ]);

    $I->seeResponseIsJson();
    $access_token = $I->grabDataFromResponseByJsonPath('$.access_token')[0];

    $I->amGoingTo('Fetch order from protected endpoint');

    // Set authorization.
    $I->haveHttpHeader('Authorization', "Bearer $access_token");

    // Set JSON API header.
    $I->haveHttpHeader('Content-Type', 'application/vnd.api+json');
    $I->sendGET("/v1/donations/jsonapi/commerce_order/gift/$order_uuid", [
      'include' => 'billing_profile,field_event_code',
    ]);

    // Clean up.
    $I->deleteHeader('Authorization');

    $I->seeResponseIsJson();

    return $I->grabDataFromResponseByJsonPath('$.data');
  }

  /**
   * Generate new Stripe token.
   */
  public function getStipeToken() {
    // Gifts Stripe token.
    Stripe::setApiKey(self::$stripe_secret_key);

    $token = StripeToken::create(array(
      "card" => array(
        "number" => "4242424242424242",
        "exp_month" => 4,
        "exp_year" => 2022,
        "cvc" => "123"
      )
    ));

    return $token->id;
  }

  /**
   * Creates fake approved Paypal payment and returns it's ID.
   *
   * NOTE: this is not how fronend works and more like a workaround because
   * there is no way to replicate current frontend-backend workflow on backend only.
   *
   * @param float $total
   *   Total payment amount.
   * @param string $currency
   *   Currency
   * @return string
   *   Payment ID in approved status.
   */
  public function makeFakePaypalPayment($total, $currency) {
    $apiContext = new ApiContext(
      new OAuthTokenCredential(self::$paypal_client_id, self::$paypal_client_secret)
    );

    $apiContext->setConfig([
      'mode' => 'sandbox',
      'cache.enabled' => TRUE,
      'cache.FileName' => 'paypal_sdk.auth.cache',
    ]);

    $card = new PaymentCard();
    $card->setType("visa")
      ->setNumber("4012888888881881")
      ->setExpireMonth("11")
      ->setExpireYear("2022")
      ->setCvv2("012")
      ->setFirstName("Test")
      ->setBillingCountry("IE")
      ->setLastName("Suite");

    $fi = new FundingInstrument();
    $fi->setPaymentCard($card);

    $payer = new Payer();
    $payer->setPaymentMethod("credit_card")
      ->setFundingInstruments(array($fi));

    $amount = new Amount();
    $amount->setCurrency($currency)
      ->setTotal($total);

    $transaction = new Transaction();
    $transaction->setAmount($amount)
      ->setDescription("Test Suite payment")
      ->setInvoiceNumber(uniqid());

    $payment = new Payment();
    $payment->setIntent("sale")
      ->setPayer($payer)
      ->setTransactions(array($transaction));

    $payment->create($apiContext);
    return $payment->getId();
  }
}
