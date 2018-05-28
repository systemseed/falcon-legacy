<?php
namespace Step\Acceptance;

class FrontendTester extends \AcceptanceTester {

  /**
   * Helper to add test gift to basket.
   *
   * @param bool $force
   *   Force proceed if basket has corporate gifts.
   */
  public function addGiftToBasket($gift, $force = FALSE) {
    $I = $this;
    $I->amGoingTo('Open ' . $gift['title'] . ' detailed page.');
    $I->amOnPage($gift['path']);

    $I->waitForText($gift['title']);

    $this->clickAddToBasket();

    // Confirm basket type change.
    if ($force) {
      try {
        $I->waitForText('Confirm to clear basket', 1);
        $I->click('Proceed', '.modal-body');
      }
      catch (\Exception $e) {
        return;
      }
    }

  }

  /**
   * Helper to add test corporate gift to basket.
   */
  public function addCorporateGiftToBasket($corporate_gift) {
    $I = $this;
    $I->amGoingTo('Open ' . $corporate_gift['title'] . ' detailed page.');
    $I->amOnPage($corporate_gift['path']);

    $I->waitForText($corporate_gift['title']);

    $this->clickAddToBasket();
  }

  /**
   * Click "Add to basket" on product page.
   */
  public function clickAddToBasket() {
    $I = $this;
    $I->amGoingTo('Click "Add to basket" button');
    // NOTE: em uses absolute position and can't be clicked by it's inner text.
    $I->click('button.add-to-cart em', '.product-tools');
  }

  /**
   * Click "Buy now" on product page.
   */
  public function clickBuyNow() {
    $I = $this;
    // NOTE: em uses absolute position and can't be clicked by it's inner text.
    $I->amGoingTo('Click "Buy Now" button');
    $I->click('button.add-to-cart.buy-now em', '.product-tools');
  }

  /**
   * Make sure payment buttons are visible.
   */
  public function seePaymentButtons() {
    $I = $this;
    $I->cantSee('CONTINUE TO PAYMENT', '.checkout-payment');

    $I->expectTo('See Stripe button');
    $I->canSee('Pay With Card', '.StripeCheckout');
    $I->expectTo('See Paypal button');
    $I->waitForElement('.paypal-button-context-iframe');
  }

  public function cantSeePaymentButtons() {
    $I = $this;
    // Make sure payment buttons have been loaded.
    $I->wait(1);

    $I->expectTo('See Continue to Payment button');
    $I->canSee('CONTINUE TO PAYMENT', '.checkout-payment');

    $I->cantSee('Pay With Card', '.StripeCheckout');
    $I->cantSeeElement('.xcomponent-paypal-button iframe');
  }

  /**
   * Helper to fill in checkout form.
   *
   * @param array $profile
   *   Array with form data in format of ConfigContent::profileData.
   *
   * @return array
   *   Profile data used for the form.
   */
  public function fillCheckoutForm(array $profile) {
    $I = $this;
    $region = $I->getRegion();

    // Prepare profile if it was not passed explicitly.
    if (empty($profile['root_field_profile_email'])) {
      $profile['root_field_profile_email'] = 'falcon.test-gifts.' . time() . '@systemseed.com';
    }
    if (empty($profile['root_field_event_code'])) {
      // Event code. Grab first value.
      $event_code_option = $I->grabTextFrom('select#root_field_event_code option:nth-child(2)');
      $profile['root_field_event_code'] = $event_code_option;
    }

    $I->amGoingTo('Fill in checkout form');

    // Choose title.
    if (!empty($profile['root_field_profile_title'])) {
      $I->selectOption('#root_field_profile_title', $profile['root_field_profile_title']);
    }

    // Text fields.
    $I->fillField('#root_field_profile_first_name', $profile['root_field_profile_first_name']);
    $I->fillField('#root_field_profile_last_name', $profile['root_field_profile_last_name']);
    $I->fillField('#root_field_profile_email', $profile['root_field_profile_email']);
    $I->fillField('#root_field_profile_phone', $profile['root_field_profile_phone']);
    $I->fillField('#root_address_line1', $profile['root_address_line1']);
    $I->fillField('#root_address_line2', $profile['root_address_line2']);
    $I->fillField('#root_locality', $profile['root_locality']);

    // Fill in postal code field.
    if (!empty($profile['root_postal_code'])) {
      $I->fillField('#root_postal_code', $profile['root_postal_code']);
    }
    else {
       $I->selectOption('#root_administrative_area', $profile['root_administrative_area']);
    }
    $I->selectOption('#root_country_code', $profile['root_country_code']);

    // Event code.
    $I->selectOption('#root_field_event_code', $profile['root_field_event_code']);

    // Opt-ins.
    // TODO: update & refactor in https://www.pivotaltracker.com/story/show/148679037.
    foreach ($profile['optins'] as $key => $value) {
      if ($I->getRegion() === 'ie') {
        // Check if opt-in is presented on the page.
        if (count($I->grabMultiple("#$key", 'value'))) {
          if ($value === TRUE) {
            $I->click("#$key");
          }
          else {
            $I->cantSeeCheckboxIsChecked("#$key");
          }
        }
      }
      else {
        if ($value === FALSE) {
          $I->click("#$key");
        }
        else {
          $I->canSeeCheckboxIsChecked("#$key");
        }
      }
    }

    // Return profile so caller can use data for backend checks.
    return $profile;
  }

  /**
   * Helper to add multiple products to Gifts.
   *
   * @param int $max_count
   *
   * @return array
   *   Array of products in basket.
   */
  public function addMultiple($max_count = 3) {
    $I = $this;

    $products = [];
    $currency = $I->getCurrency();
    $total = 0;

    $I->amGoingTo("Visit frontpage and add $max_count gifts to the basket");
    $I->amOnPage('/');

    // Wait until products are loaded.
    $I->waitForText('HEALTH AND SAFETY', 15);

    $I->expectTo("See 0 items in basket");
    $I->see('0', 'span.count');

    for ($i = 1; $i <= $max_count; $i++) {
      $I->moveMouseOver(".col-md-4.col-sm-6:nth-child($i) .shop-item");

      $title = $I->grabTextFrom(".col-md-4.col-sm-6:nth-child($i) .shop-item-title a");
      $products[$i]['title'] = $title;

      $price_formatted = $I->grabTextFrom(".col-md-4.col-sm-6:nth-child($i) .shop-item-price span");

      $price_number = floatval(str_replace(['€', '£', ','], '', $price_formatted));
      $products[$i]['price'][$currency] = [
        'number' => $price_number,
        'formatted' => $price_formatted,
      ];

      $total += $price_number;

      $I->click(".col-md-4.col-sm-6:nth-child($i) .shop-item .add-to-cart em");
      $I->see($i, 'span.count');
    }

    $I->amGoingTo('Go to basket');
    $I->moveMouseOver(".toolbar .cart-btn");
    $I->click('Go to basket');

    $I->waitForText('Shopping Basket');

    $I->canSee(number_format($total, 2), 'aside .amount');
    $I->canSee('CHECKOUT', '.btn-primary');

    return $products;
  }

  /**
   * Helper to click PayPal button
   *
   * @param $total_formatted
   *   Total order amount to check in PayPal interface.
   */
  public function payWithPayPal($total_formatted) {
    $I = $this;

    // Increase this timeout if you can see __prerender__ at the beginning of
    // iframe name.
    $I->wait(5);
    $iframe_name = $I->grabAttributeFrom('.paypal-button-context-iframe iframe', 'name');
    // Paypal button lives in an iframe. Switch into it.
    $I->switchToIFrame($iframe_name);
    $I->seeElement('div.paypal-button');

    // Click on Paypal button.
    $I->click('div.paypal-button');
    $I->wait(1);

    // Paypal will open a new window. Switch to it.
    $I->switchToNextTab();
    $I->waitForText('PayPal', 80);
    $I->wait(2);

    if ($I->seePageHasElement($I, '#loginSection .btn')) {
      $I->click('#loginSection .btn');
      $I->waitForElement('#btnNext');
      $I->wait(2);
    }

    // PayPal authentication step 1: Email.
    $I->fillField('login_email', 'test-concern-roi-account@systemseed.com');
    $I->click('#btnNext');

    $I->waitForElement('input[name=login_password]');
    $I->wait(2);

    // PayPal authentication step 2: password.
    $I->fillField('login_password', 'C0nc3rn!');
    $I->click('#btnLogin');

    // Switch to parent window and then back to Paypal window to exit iframe.
    $I->switchToNextTab();
    $I->switchToNextTab();

    // Wait for Buy Now button in Paypal window.
    $I->waitForElement('#confirmButtonTop', 80);

    $I->expectTo('See correct total amount.');
    $I->see($total_formatted);
    $I->wait(3);

    $I->click('#confirmButtonTop');

    // Switch back to parent window.
    $I->switchToWindow();
    // Make sure we are in correct window.
    $I->canSeeElement('.checkout-payment');
  }

}
