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

    $I->payWithPayPal($gift['price'][$currency]['formatted']);

    $I->waitForText('Please wait', 15);

    $I->waitForText('order is complete', 60);
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

}
