<?php
namespace shared\frontend;
use Step\Acceptance\FrontendTester;

/**
 * Class GiftsBasket
 * @package shared\frontend
 *
 * @env chrome
 * @group frontend-gifts
 */
class GiftsBasketCest {

  /**
   * Make sure basket data is persistant.
   *
   * @param \Step\Acceptance\FrontendTester $I
   */
  public function reloadBasketPage(FrontendTester $I) {
    $currency = $I->getCurrency();
    $gift = $I->getGiftData();
    $I->amGoingTo('Add gift to basket and reload the page.');
    $I->addGiftToBasket();
    $I->click('.toolbar a[href="/basket"]');

    $I->waitForText($gift['title'], 10);
    $I->canSee('Shopping Basket');
    $I->canSee($gift['price'][$currency]['formatted']);
    $I->canSee('Currently 1 item in cart');
    $I->canSee('CHECKOUT', '.btn-primary');

    $I->reloadPage();
    $I->waitForText($gift['title'], 10);
    $I->canSee('Shopping Basket');
    $I->canSee($gift['price'][$currency]['formatted']);
    $I->canSee('Currently 1 item in cart');
    $I->canSee('CHECKOUT', '.btn-primary');
  }

  /**
   * Change product quantity.
   *
   * @param \Step\Acceptance\FrontendTester $I
   */
  public function checkQuantity(FrontendTester $I) {
    $currency = $I->getCurrency();
    $gift = $I->getGiftData();
    $I->amGoingTo('Add gift to basket.');
    $I->addGiftToBasket();
    $I->click('.toolbar a[href="/basket"]');

    // Wait until basket loaded.
    $I->waitForText($gift['title'], 10);

    // Default - 1 item.
    $I->expectTo("See 1 item of test gift in basket");
    $I->canSee("Currently 1 item in cart");
    $I->expectTo("See '-' button is disabled");
    $I->canSeeElement('.count-input button:nth-of-type(1)', ['disabled' => TRUE]);
    $I->expectTo('See correct total amount');
    $I->canSee($gift['price'][$currency]['formatted'], 'aside .amount');

    // Increase - 2 items.
    $I->amGoingTo('Click on + button to increase quantity');
    $I->click('.count-input button:nth-of-type(2)');
    $I->expectTo("See '-' button is enabled");
    $I->cantSeeElement('.count-input button:nth-of-type(1)', ['disabled' => TRUE]);
    $I->expectTo("See 2 items of test gift in basket");
    $I->canSee(2, '.shopping-cart .count-input span.quantity');
    $I->canSee("Currently 2 items in cart");
    $I->expectTo('See correct total amount');
    $I->canSee(number_format($gift['price'][$currency]['number'] * 2, 2), 'aside .amount');

    // Decrease - 1 item.
    $I->amGoingTo("Click on '-' button to descrease quantity");
    $I->click('.count-input button:nth-of-type(1)');
    $I->expectTo("See 1 items of test gift in basket");
    $I->canSee(1, '.shopping-cart .count-input span.quantity');
    $I->canSee("Currently 1 item in cart");
    $I->expectTo("See '-' button is disabled");
    $I->canSeeElement('.count-input button:nth-of-type(1)', ['disabled' => TRUE]);
    $I->expectTo('See correct total amount');
    $I->canSee($gift['price'][$currency]['formatted'], 'aside .amount');
    $I->canSee('CHECKOUT', '.btn-primary');
  }

  /**
   * Remove items from the basket.
   *
   * @param \Step\Acceptance\FrontendTester $I
   */
  public function removeItems(FrontendTester $I) {
    $gift = $I->getGiftData();
    $I->amGoingTo('Add gift to basket.');
    $I->addGiftToBasket();
    $I->click('.toolbar a[href="/basket"]');

    // Wait until basket loaded.
    $I->waitForText($gift['title'], 10);
    $I->canSee('CHECKOUT', '.btn-primary');

    $I->amGoingTo('Click on Remove icon.');
    $I->click('button.item-remove');

    $I->expectTo('See empty basket');
    $I->canSee('Your basket is empty.');
    $I->cantSee('CHECKOUT', '.btn-primary');
  }

  /**
   * Test ability to add custom donation.
   *
   * @param \Step\Acceptance\FrontendTester $I
   */
  public function addCustomDonation(FrontendTester $I) {
    $currency = $I->getCurrency();
    $custom_donation = 19.00;

    $gift = $I->getGiftData();
    $I->amGoingTo('Add gift to basket.');
    $I->addGiftToBasket();
    $I->click('.toolbar a[href="/basket"]');

    // Wait until basket loaded.
    $I->waitForText($gift['title'], 10);
    $I->canSee('Would you like to make a donation as well');

    $I->amGoingTo('Add custom donation.');
    $I->fillField('#root_amount', $custom_donation);
    $I->click('Add Donation');

    $I->expectTo('See custom donation added to basket');
    $I->canSee('Custom donation');
    $I->canSee(number_format($custom_donation, 2));
    $total = number_format($custom_donation + $gift['price'][$currency]['number'], 2);
    $I->canSee($total, 'aside .amount');
    $I->canSee('CHECKOUT', '.btn-primary');
  }

  /**
   * Add gift to basket and switch basket type from corporate to normal.
   *
   * @param \Step\Acceptance\FrontendTester $I
   */
  public function swtichBasketType(FrontendTester $I) {
    $currency = $I->getCurrency();
    $gift = $I->getGiftData();
    $corp_gift_title = $I->getCorporateGiftData('title');

    $I->amGoingTo('Add corporate gift to basket.');
    $I->addCorporateGiftToBasket();
    $I->addGiftToBasket(TRUE);

    $I->click('.toolbar a[href="/basket"]');

    // Wait until basket loaded.
    $I->waitForText($gift['title'], 10);
    $I->cantSee($corp_gift_title);
    $I->canSee($gift['price'][$currency]['formatted'], 'aside .amount');
    $I->canSee('CHECKOUT', '.btn-primary');
  }
}
