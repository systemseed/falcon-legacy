<?php
namespace shared\frontend;

use Step\Acceptance\DonationsBackendTester;
use Step\Acceptance\FrontendTester;

/**
 * Class GiftsCheckoutPaypalCest
 * @package shared\frontend
 *
 * @env chrome
 */
class GiftsCheckoutPaypalCest {

  private $order_id = 0;
  private $basket = [];
  private $profile_data = [];
  private $currency = '';

  /**
   * Prepare checkout page for testing.
   *
   * @param \Step\Acceptance\FrontendTester $I
   */
  private function prepareCheckout(FrontendTester $I) {
    $I->amGoingTo('Add gift to basket.');
    $I->addGiftToBasket();
    $I->click('.toolbar a[href="/basket"]');

    $I->click('Checkout');
    $I->canSee('Checkout and save lives');

    // Wait until the form is loaded.
    $I->waitForElement('#root_field_event_code', 15);
  }

  /**
   * Complete Paypal checkout.
   *
   * @param \Step\Acceptance\FrontendTester $I
   *
   * @group frontend-gifts
   */
  public function checkoutComplete(FrontendTester $I) {
    $this->prepareCheckout($I);

    $currency = $I->getCurrency();
    $gift = $I->getGiftData();

    // Fill in the form with valid data. Buttons should be visible.
    $profile = $I->fillCheckoutForm();
    $I->seePaymentButtons();

    // Paypal button lives in an iframe. Switch into it.
    $iframe_name = $I->grabAttributeFrom('.paypal-button-context-iframe iframe', 'name');
    $I->switchToIFrame($iframe_name);
    $I->canSeeElement('#paypal-button');

    // Click on Paypal button.
    $I->click('#paypal-button');
    $I->wait(1);

    // Paypal will open new window. Switch to it.
    $I->switchToNextTab();
    $I->waitForText('PayPal', 60);
    $I->wait(2);
    $I->canSee($gift['price'][$currency]['formatted']);

    // Paypal will render auth form into iframe. Switch to it.
    $I->waitForElement('#injectedUnifiedLogin iframe');
    $I->switchToIFrame('injectedUl');

    $I->fillField('login_email', 'falcon-test@systemseed.com');
    $I->fillField('login_password', 'FALC0n$!');
    $I->click('#btnLogin');

    // Switch to parent window and then back to Paypal window to exit iframe.
    $I->switchToNextTab();
    $I->switchToNextTab();

    // Wait for Buy Now button in Paypal window.
    $I->waitForElement('#confirmButtonTop', 60);
    $I->wait(3);

    $I->click('#confirmButtonTop');

    // Switch back to parent window.
    $I->switchToWindow();
    // Make sure we are in correct window.
    $I->canSeeElement('.checkout-payment');

    $I->waitForText('Please wait', 15);

    $I->waitForText('order has been completed', 60);
    $I->canSeeInCurrentUrl('/complete');

    // Store data for backend checks.
    $this->order_id = $I->grabFromCurrentUrl('~checkout/(\d+)/complete~');
    $this->basket[] = $gift;
    $this->profile_data = $profile;
    $this->currency = $currency;
  }

  /**
   * Check order data in Donations backend.
   *
   * @param \Step\Acceptance\DonationsBackendTester $I
   *
   * @depends checkoutComplete
   * @group backend-donations
   */
  public function checkOrderOnBackend(DonationsBackendTester $I) {
    $I->login('gifts_manager.test');

    $I->checkOrderData($this->order_id, $this->basket, $this->profile_data, $this->currency);
  }

  /**
   * Push order to ThankQ and make sure it was created successfully.
   *
   * @param \Step\Acceptance\DonationsBackendTester $I
   *
   * @depends checkoutComplete
   * @group backend-donations
   */
  public function checkOrderThankqSimple(DonationsBackendTester $I) {
    $I->login('gifts_manager.test');

    $I->runGiftsThankQSync($this->order_id, $this->basket, $this->profile_data, $this->currency);
  }
}
