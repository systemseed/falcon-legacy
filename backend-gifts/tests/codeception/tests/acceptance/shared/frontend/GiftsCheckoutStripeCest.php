<?php
namespace shared\frontend;

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
    $I->waitForElement('#root_field_event_code');
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
    $gift = $I->getGiftData();
    $I->expectTo('See correct total amount');
    $I->canSee('Basket total:');
    $I->canSee($gift['price'][$currency]['formatted']);

    // By default, payment buttons are hidden.
    $I->cantSeePaymentButtons();

    // Fill in one field. Buttons should be still hidden.
    $I->fillField('#root_field_profile_first_name', 'Tested');
    $I->cantSeePaymentButtons();

    // Fill in the form with valid data. Buttons should be visible.
    $profile = $I->fillCheckoutForm();
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
    $gift = $I->getGiftData();

    // Fill in the form with valid data. Buttons should be visible.
    $profile = $I->fillCheckoutForm();
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

    $I->waitForText('order has been completed', 30);
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
  public function checkOrderThankqSimple(DonationsBackendTester $I) {
    $I->login('gifts_manager.test');

    $I->runGiftsThankQSync($this->order_id, $this->basket, $this->profile_data, $this->currency);
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
    $products = $I->addMultiple(5);

    $I->waitForElement('#root_amount', 15);

    $I->amGoingTo('Add custom donation.');
    $I->fillField('#root_amount', 50);
    $I->click('Add Donation');
    $products[] = [
      'title' => 'Donation',
      'price' => [$currency => ['number' => 50.00]],
    ];

    // Scroll back to top to make checkout button visible.
    $I->scrollTo('h1');

    $I->click('Checkout');
    $I->canSee('Checkout and save lives');

    // Wait until the form is loaded.
    $I->waitForElement('#root_field_event_code');

    // Fill in the form with valid data. Buttons should be visible.
    $profile = $I->fillCheckoutForm();
    $I->seePaymentButtons();

    $I->click('Pay With Card');
    $I->waitForElement('iframe.stripe_checkout_app');
    $I->switchToIFrame('stripe_checkout_app');
    $I->fillField('Card number', '4242424242424242');
    $I->fillField('Expiry', '0222');
    $I->fillField('CVC', '123');
    $I->click('Pay');

    $I->waitForText('Please wait', 20);

    $I->waitForText('order has been completed', 30);
    $I->canSeeInCurrentUrl('/complete');

    // Store data for backend checks.
    $this->order_id = $I->grabFromCurrentUrl('~checkout/(\d+)/complete~');
    $this->basket = $products;
    $this->profile_data = $profile;
    $this->currency = $currency;
  }

  /**
   * Push order with multiple products to ThankQ and make sure it was created
   * successfully.
   *
   * @param \Step\Acceptance\DonationsBackendTester $I
   *
   * @depends checkoutCompleteComplex
   * @group backend-donations
   */
  public function checkOrderThankqComplex(DonationsBackendTester $I) {
    $I->login('gifts_manager.test');

    $I->runGiftsThankQSync($this->order_id, $this->basket, $this->profile_data, $this->currency);
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
    $gift = $I->getGiftData();

    $I->amGoingTo('Add two gifts to basket.');
    $I->addGiftToBasket();
    $I->addGiftToBasket();

    $total = $gift['price'][$currency]['number'] * 2;
    $total_formatted = number_format($total, 2);

    $I->click('.toolbar a[href="/basket"]');

    $I->click('Checkout');
    $I->canSee('Checkout and save lives');

    // Wait until cards part of the form is loaded.
    $I->waitForText($gift['title']);
    $I->canSee('Step 2 - Choose a card to go with your gifts');

    $I->expectTo('See two card configuration rows for the same product');
    $I->canSee($gift['title'], '.checkout-container .row.checkout-cards-list .row .col-xs-12:nth-of-type(1) .card-product');
    $I->canSee($gift['title'], '.checkout-container .row.checkout-cards-list .row .col-xs-12:nth-of-type(2) .card-product');

    // Fill in the form with valid data. Buttons should be visible.
    $profile = $I->fillCheckoutForm();
    $I->seePaymentButtons();

    // Choose "Email" type for the first item.
    $I->selectOption('.checkout-container .row.checkout-cards-list .row .col-xs-12:nth-of-type(1) .card-product input', 'email');

    $I->cantSeePaymentButtons();
    $I->scrollTo('.primary-buttons');

    $I->fillField('#root_field_friends_name', 'Tester Best Friend');
    $I->fillField('#root_field_friends_email', 'test-falcon.friend@systemseed.com');
    $I->fillField('#root_field_message', 'Hello from robots!');

    $I->click('Save');
    $I->seePaymentButtons();

    $I->click('Pay With Card');
    $I->waitForElement('iframe.stripe_checkout_app');
    $I->switchToIFrame('stripe_checkout_app');
    $I->canSee($total_formatted);

    $I->fillField('Card number', '4242424242424242');
    $I->fillField('Expiry', '0222');
    $I->fillField('CVC', '123');
    $I->click('Pay');

    $I->waitForText('Please wait', 20);

    $I->waitForText('order has been completed', 30);
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
    $I->canSee('test-falcon.friend@systemseed.com');
    $I->canSee('Hello from robots!');
  }
}
