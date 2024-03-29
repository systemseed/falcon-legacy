<?php
namespace falcon;

use Step\Acceptance\DonationsBackendTester;
use Step\Acceptance\DrupalTester;
use Step\Acceptance\FrontendTester;

/**
 * Class GiftsCheckoutStripeCest
 * @package shared\frontend
 *
 * @env chrome
 */
class GiftsCheckoutStripeCest {

  private $order_id = 0;
  private $basket = [];
  private $profile_data = [];
  private $currency = '';
  private $friend_email = '';

  /**
   * Prepare checkout page for testing.
   *
   * @param \Step\Acceptance\FrontendTester $I
   */
  private function prepareCheckout(FrontendTester $I) {
    $I->amGoingTo('Add gift to basket.');
    $I->addGiftToBasket(\ContentConfig::getGiftData());
    $I->click('.toolbar a[href="/basket"]');
    // Wait till cart dropdown is hidden.
    $I->moveMouseOver('.top-bar');
    $I->waitForElementNotVisible('.cart-dropdown');

    $I->click('Checkout', '.sticky-outer-wrapper');
    $I->canSee('Checkout and save lives');

    $I->waitForElementVisible('.sticky-outer-wrapper');
    $I->click('Continue checkout', '.sticky-outer-wrapper');
    $I->canSee('Checkout and save lives');

    // Wait until the form is loaded.
    $I->waitForElement('#root_field_event_code', 15);
  }

  /**
   * Test checkout form validation.
   *
   * @param \Step\Acceptance\FrontendTester $I
   *
   * @group frontend-gifts
   */
  public function checkoutValidate(FrontendTester $I) {
    $this->prepareCheckout($I);

    $currency = $I->getCurrency();
    $gift = \ContentConfig::getGiftData();
    $I->expectTo('See correct total amount');
    $I->canSee('Basket subtotal:');
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
    $gift = \ContentConfig::getGiftData();

    // Fill in the form with valid data. Buttons should be visible.
    $profile = $I->fillCheckoutForm(\ContentConfig::getProfileData());
    $I->seePaymentButtons();

    $I->click('Pay With Card', 'aside.checkout-payment');
    $I->waitForElement('iframe.stripe_checkout_app');
    $I->switchToIFrame('stripe_checkout_app');
    $I->canSee('Pay ' . $gift['price'][$currency]['formatted']);

    $I->fillField('Card number', '4242424242424242');
    $I->fillField('Expiry', '0222');
    $I->fillField('CVC', '123');
    $I->click('Pay');

    $I->waitForText('Please wait', 20);

    $I->waitForText('order is complete', 30);
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

    // Call DonationsBackendTester helper to check all order data.
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
  public function checkOrderThankqSimple(DonationsBackendTester $I, $scenario) {
    $I->login('gifts_manager.test');

    if ($I->seeThankQIsEnabled()) {
      $I->runGiftsThankQSync($this->order_id, $this->basket, $this->profile_data, $this->currency);
    }
    else {
      $I->comment('ThankQ CRM is not configured. Skipping.');
      $scenario->skip();
    }
  }

  /**
   * Place a complex order (multiple products).
   *
   * @param \Step\Acceptance\FrontendTester $I
   *
   * @group frontend-gifts
   */
  public function checkoutCompleteComplex(FrontendTester $I) {
    $currency = $I->getCurrency();
    $products = $I->addMultiple(4);

    $I->waitForElement('#root_amount', 15);

    $I->amGoingTo('Add custom donation.');
    $I->fillField('#root_amount', 50);
    $I->click('Add Donation');
    $products[] = [
      'title' => 'Donation',
      'price' => [$currency => ['number' => 50.00]],
    ];

    // Click on Checkout sometimes fails in Chrome with error: Other element
    // would receive the click.
    $I->click('Checkout', '.sticky-outer-wrapper');
    $I->canSee('Checkout and save lives');

    $I->waitForElementVisible('.sticky-outer-wrapper');
    $I->click('Continue checkout', '.sticky-outer-wrapper');
    $I->canSee('Checkout and save lives');

    // Wait until the form is loaded.
    $I->waitForElement('#root_field_event_code', 15);

    // Fill in the form with valid data. Buttons should be visible.
    $profile = $I->fillCheckoutForm(\ContentConfig::getProfileData());
    $I->seePaymentButtons();

    $I->click('Pay With Card', 'aside.checkout-payment');
    $I->waitForElement('iframe.stripe_checkout_app');
    $I->switchToIFrame('stripe_checkout_app');

    $I->fillField('Card number', '4242424242424242');
    $I->fillField('Expiry', '0222');
    $I->fillField('CVC', '123');
    $I->click('Pay');

    $I->waitForText('Please wait', 20);

    $I->waitForText('order is complete', 30);
    $I->canSeeInCurrentUrl('/complete');

    // Store data for backend checks.
    $this->order_id = $I->grabFromCurrentUrl('~checkout/(\d+)/complete~');
    $this->basket = $products;
    $this->profile_data = $profile;
    $this->currency = $currency;
  }

  /**
   * Complete Stripe checkout with E-cards.
   *
   * @param \Step\Acceptance\FrontendTester $I
   *
   * @group frontend-gifts
   */
  public function checkoutWithCards(FrontendTester $I) {
    $currency = $I->getCurrency();
    $gift = \ContentConfig::getGiftData();

    $I->amGoingTo('Add two gifts to basket.');
    $I->addGiftToBasket(\ContentConfig::getGiftData());
    $I->addGiftToBasket(\ContentConfig::getGiftData());

    $total = $gift['price'][$currency]['number'] * 2;
    $total_formatted = number_format($total, 2);

    $I->click('.toolbar a[href="/basket"]');
    // Wait till cart dropdown is hidden.
    $I->moveMouseOver('.top-bar');
    $I->waitForElementNotVisible('.cart-dropdown');

    $I->click('Checkout', '.sticky-outer-wrapper');
    $I->canSee('Checkout and save lives');

    // Wait until cards part of the form is loaded.
    $I->waitForText($gift['title']);

    $I->expectTo('See two card configuration rows for the same product');
    $I->canSee($gift['title'], '.checkout-container .row.checkout-cards-list .row .col-xs-12:nth-of-type(1) .card-product');
    $I->canSee($gift['title'], '.checkout-container .row.checkout-cards-list .row .col-xs-12:nth-of-type(2) .card-product');

    $I->canSee('Continue checkout', '.checkout-submit-real');

    // Choose "Email" type for the first item.
    $I->clickWithLeftButton('.checkout-container .row.checkout-cards-list .row .col-xs-12:nth-of-type(1) .card-product .option-wrapper:nth-of-type(2)');

    $I->canSee('Continue checkout', '.checkout-submit-fake');

    $I->fillField('input[id$="_field_friends_name"]', 'Tester Best Friend');

    $this->friend_email = 'test-cw2+friend' . rand(0, 999) . '@systemseed.com';
    $I->fillField('input[id$="_field_friends_email"]', $this->friend_email);
    $I->fillField('textarea[id$="_field_message"]', 'Hello from robots!');

    $I->canSee('Continue checkout', '.checkout-submit-real');

    $I->click('Continue checkout', '.sticky-outer-wrapper');
    $I->canSee('Checkout and save lives');

    // Fill in the form with valid data. Buttons should be visible.
    $profile = $I->fillCheckoutForm(\ContentConfig::getProfileData());
    $I->seePaymentButtons();

    $I->click('Pay With Card', 'aside.checkout-payment');
    $I->waitForElement('iframe.stripe_checkout_app');
    $I->switchToIFrame('stripe_checkout_app');
    $I->canSee($total_formatted);

    $I->fillField('Card number', '4242424242424242');
    $I->fillField('Expiry', '0222');
    $I->fillField('CVC', '123');
    $I->click('Pay');

    $I->waitForText('Please wait', 20);

    $I->waitForText('order is complete', 30);
    $I->canSeeInCurrentUrl('/complete');
  }

  /**
   * Check E-cards data in Gifts backend.
   *
   * @param \Step\Acceptance\DrupalTester $I
   *
   * @depends checkoutWithCards
   */
  public function checkCardsBackend(DrupalTester $I) {
    $I->login('gifts_manager.test');

    $I->amOnPage('admin/structure/ecard_item');
    $I->waitForText('E-Card Item list');

    $card_link = $I->grabAttributeFrom('table tbody > tr:nth-of-type(1) a', 'href');
    $card_link = str_replace('/edit', '', $card_link);

    $I->amOnUrl($card_link);

    $I->waitForText('Tester Best Friend');
    $I->canSee($this->friend_email);
    $I->canSee('Hello from robots!');
  }
}
