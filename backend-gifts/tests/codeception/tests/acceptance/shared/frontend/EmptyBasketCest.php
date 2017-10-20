<?php
namespace shared\frontend;
use \AcceptanceTester;

/**
 * Class EmptyBasketCest
 * @package shared\frontend
 *
 * @env chrome
 * @group frontend-gifts
 */
class EmptyBasketCest {

  /**
   * Test empty basket.
   *
   * @param \AcceptanceTester $I
   */
  public function emptyBasket(AcceptanceTester $I) {
    $I->amGoingTo('Visit empty basket');
    $I->amOnPage('/basket');

    $I->canSee('Shopping Basket');
    $I->canSee('Your basket is empty.');
    $I->cantSee('CHECKOUT', '.btn-primary');
  }

  /**
   * Test empty checkout.
   *
   * @param \AcceptanceTester $I
   */
  public function emptyCheckout(AcceptanceTester $I) {
    $I->amGoingTo('Visit checkout URL with empty basket');
    $I->amOnPage('/checkout');

    $I->canSee('Checkout and save lives');
    $I->canSee('Your basket is empty.');
  }
}
