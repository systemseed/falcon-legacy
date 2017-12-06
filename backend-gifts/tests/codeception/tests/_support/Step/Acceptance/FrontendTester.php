<?php
namespace Step\Acceptance;

class FrontendTester extends \AcceptanceTester {
  protected $gift = [
    'id' => 13,
    'uuid' => '355215cd-f4f2-4525-a29b-54c26f8cc1ac',
    'title' => 'Piglet',
    'path' => '/gifts/piglet',
    'annotation' => 'This piglet goes to help a family in need',
    'description' => 'When you buy this gift, you’ll receive a special card to pass on to your',
    'category' => 'Animal',
    'price' => [
      'EUR' => ['number' => 10.00, 'formatted' => '€10.00'],
      'GBP' => ['number' => 8.00, 'formatted' => '£9.00'],
    ]
  ];

  protected $corporateGift = [
    'id' => 46,
    'uuid' => '663097a5-df42-4882-b8d5-20fc6674fa5f',
    'title' => 'Corporate Koala (Test Suite)',
    'path' => '/corporate/corporate-koala-test-suite',
    'annotation' => 'Test suite corporate product.',
    'description' => 'Compellingly engage process-centric users rather than',
    'price' => [
      'EUR' => ['number' => 570.00, 'formatted' => '€570.00'],
      'GBP' => ['number' => 570.00, 'formatted' => '£570.00'],
    ]
  ];

  protected $profileData = [
    'root_field_profile_first_name' => 'Test',
    'root_field_profile_last_name' => 'Suite',
    'root_field_profile_email' => 'falcon.test-gifts.profile@systemseed.com',
    'root_field_profile_phone' => '12345678',
    'root_address_line1' => 'Address Line 1',
    'root_address_line2' => 'Address Line 2',
    'root_locality' => 'Dublin',
    'root_postal_code' => 'ASCN 1ZZ',
    'root_administrative_area' => 'Co. Dublin',
    'root_country_code' => 'Republic of Ireland',
    'optins' => [
      'root_field_profile_prefs_sms' => TRUE,
      'root_field_profile_prefs_phone' => TRUE,
      'root_field_profile_prefs_post' => TRUE,
      'root_field_profile_prefs_email' => FALSE,
    ],
  ];

  public function getGiftData($prop = NULL) {
    if (empty($prop)) {
      return $this->gift;
    }

    return $this->gift[$prop];
  }

  public function getCorporateGiftData($prop = NULL) {
    if (empty($prop)) {
      return $this->corporateGift;
    }

    return $this->corporateGift[$prop];
  }

  /**
   * Helper to add test gift to basket.
   *
   * @param bool $force
   *   Force proceed if basket has corporate gifts.
   */
  public function addGiftToBasket($force = FALSE) {
    $I = $this;
    $I->amGoingTo('Open ' . $this->gift['title'] . ' detailed page.');
    $I->amOnPage($this->gift['path']);

    $I->waitForText($this->gift['title']);

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
  public function addCorporateGiftToBasket() {
    $I = $this;
    $I->amGoingTo('Open ' . $this->corporateGift['title'] . ' detailed page.');
    $I->amOnPage($this->corporateGift['path']);

    $I->waitForText($this->corporateGift['title']);

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
   * @param array|null $profile
   *   Array with form data in format of $this->profileData.
   *
   * @return array
   *   Profile data used for the form.
   */
  public function fillCheckoutForm($profile = NULL) {
    $I = $this;
    $region = $I->getRegion();

    // Prepare profile if it was not passed explicitly.
    if (empty($profile)) {
      $profile = $this->profileData;
      $profile['root_field_profile_email'] = 'falcon.test-gifts.' . time() . '@systemseed.com';
      // Event code. Grab first value.
      $event_code_option = $I->grabTextFrom('select#root_field_event_code option:nth-child(2)');
      $profile['root_field_event_code'] = $event_code_option;
    }

    $I->amGoingTo('Fill in checkout form');

    // Choose title.
    if ($region == 'gb') {
      $I->selectOption('#root_field_profile_title', 'Mr');
    }

    // Text fields.
    $I->fillField('#root_field_profile_first_name', $profile['root_field_profile_first_name']);
    $I->fillField('#root_field_profile_last_name', $profile['root_field_profile_last_name']);
    $I->fillField('#root_field_profile_email', $profile['root_field_profile_email']);
    $I->fillField('#root_field_profile_phone', $profile['root_field_profile_phone']);
    $I->fillField('#root_address_line1', $profile['root_address_line1']);
    $I->fillField('#root_address_line2', $profile['root_address_line2']);
    $I->fillField('#root_locality', $profile['root_locality']);

    // Fill Postal code field for UK or County for ROI.
    if ($region == 'gb') {
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
            $I->checkOption("#$key");
          }
          else {
            $I->cantSeeCheckboxIsChecked("#$key");
          }
        }
      }
      else {
        if ($value === FALSE) {
          $I->uncheckOption("#$key");
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
    $I->see($total_formatted);

    // Paypal will render auth form into iframe. Switch to it.
    $I->waitForElement('#injectedUnifiedLogin iframe');
    $I->switchToIFrame('injectedUl');

    $I->fillField('login_email', 'test-concern-roi-account@systemseed.com');
    $I->fillField('login_password', 'C0nc3rn!');
    $I->click('#btnLogin');

    // Switch to parent window and then back to Paypal window to exit iframe.
    $I->switchToNextTab();
    $I->switchToNextTab();

    // Wait for Buy Now button in Paypal window.
    $I->waitForElement('#confirmButtonTop', 80);
    $I->wait(3);

    $I->click('#confirmButtonTop');

    // Switch back to parent window.
    $I->switchToWindow();
    // Make sure we are in correct window.
    $I->canSeeElement('.checkout-payment');
  }

}
