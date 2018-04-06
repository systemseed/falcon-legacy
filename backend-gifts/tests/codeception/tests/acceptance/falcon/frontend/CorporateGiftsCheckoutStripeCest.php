<?php
namespace falcon;

use Step\Acceptance\DonationsBackendTester;
use Step\Acceptance\FrontendTester;

/**
 * Class CorporateGiftsCheckoutStripeCest
 * @package shared\frontend
 *
 * @env chrome
 */
class CorporateGiftsCheckoutStripeCest {

  private $order_id = 0;
  private $gift_data = [];
  private $profile_data = [];
  private $currency = '';

  /**
   * Prepare checkout page for testing.
   *
   * @param \Step\Acceptance\FrontendTester $I
   */
  private function prepareCheckout(FrontendTester $I) {
    $I->amGoingTo('Add gift to basket.');
    $I->addCorporateGiftToBasket(\ContentConfig::getCorporateGiftData());
    $I->click('.toolbar a[href="/basket"]');
    $I->waitForElementNotVisible('.cart-dropdown');

    $I->click('Checkout');
    $I->canSee('Checkout and save lives');

    // Wait until the form is loaded.
    $I->waitForElement('#root_field_event_code');
  }

  /**
   * Test validation of checkout form.
   *
   * @param \Step\Acceptance\FrontendTester $I
   *
   * @group frontend-gifts
   */
  public function checkoutValidate(FrontendTester $I) {
    $this->prepareCheckout($I);

    $currency = $I->getCurrency();
    $gift = \ContentConfig::getCorporateGiftData();
    $I->expectTo('See correct total amount');
    $I->canSee('Basket total:');
    $I->canSee($gift['price'][$currency]['formatted']);

    // By default, payment buttons are hidden.
    $I->cantSeePaymentButtons();

    // Fill in one field. Buttons should be still hidden.
    $I->fillField('#root_field_profile_first_name', 'Tested');
    $I->cantSeePaymentButtons();

    // Fill in the form with valid data. Buttons should be visible.
    $profile = $I->fillCheckoutForm(\ContentConfig::getProfileData());
    $I->seePaymentButtons();

    // Unset event code. Buttons should be hidden.
    $I->selectOption('#root_field_event_code', '');
    $I->cantSeePaymentButtons();

    // Restore event code. Buttons should be visible.
    $I->selectOption('#root_field_event_code', $profile['root_field_event_code']);
    $I->seePaymentButtons();

    // Input invalid email. Buttons should be hidden.
    $I->fillField('#root_field_profile_email', 'ivalid');
    $I->cantSeePaymentButtons();

    // Restore valid email. Buttons should be visible.
    $I->fillField('#root_field_profile_email', $profile['root_field_profile_email']);
    $I->seePaymentButtons();
  }

  /**
   * Complete Stripe checkout.
   *
   * @param \Step\Acceptance\FrontendTester $I
   *
   * @group frontend-gifts
   */
  public function checkoutComplete(FrontendTester $I) {
    $this->prepareCheckout($I);

    $currency = $I->getCurrency();
    $gift = \ContentConfig::getCorporateGiftData();

    // Fill in the form with valid data. Buttons should be visible.
    $profile = $I->fillCheckoutForm(\ContentConfig::getProfileData());
    $I->seePaymentButtons();

    $I->click('Pay With Card');
    $I->waitForElement('iframe.stripe_checkout_app');
    $I->switchToIFrame('stripe_checkout_app');
    $I->canSee('Pay ' . $gift['price'][$currency]['formatted']);

    $I->fillField('Card number', '4242424242424242');
    $I->fillField('Expiry', '0222');
    $I->fillField('CVC', '123');
    $I->click('Pay');

    $I->waitForText('Please wait', 20);

    $I->waitForText('order is complete', 60);
    $I->canSeeInCurrentUrl('/complete');

    // Store data for backend checks.
    $this->order_id = $I->grabFromCurrentUrl('~checkout/(\d+)/complete~');
    $this->gift_data = $gift;
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

    // Call DonationsBackendTester helper to check all order data.
    $I->checkOrderData($this->order_id, [$this->gift_data], $this->profile_data, $this->currency);
  }

}
