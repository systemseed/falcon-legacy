<?php
namespace falcon;
use Step\Acceptance\FrontendTester;

/**
 * Class GiftsCest
 * @package shared\frontend
 *
 * @env chrome
 * @group frontend-gifts
 */
class GiftsCest {

  /**
   * Test gift filters on the front page.
   *
   * @param \Step\Acceptance\FrontendTester $I
   */
  public function giftFilters(FrontendTester $I) {
    $I->amGoingTo('Visit frontpage and filter gifts by category');
    $I->amOnPage('/');

    // Wait until products are loaded.
    $I->waitForText('HEALTH AND SAFETY', 15, '.filters-bar');

    // I see at least one product.
    $I->seeElement('.shop-item');
    $I->canSeeLink(\ContentConfig::getGiftData('title'));

    $I->amGoingTo('Filter gifts by "Health and Safety" category');
    $I->expect('Not to see test gift');
    $I->click('Health and Safety', '.filters-bar');
    $I->waitForText('HEALTH AND SAFETY', 15, '.filters-bar');
    $I->dontSeeLink(\ContentConfig::getGiftData('title'));

    $category = \ContentConfig::getGiftData('category');
    $I->amGoingTo('Filter gifts by '. $category .' category');
    $I->expect('To see test gift');
    $I->click($category, '.filters-bar');
    $I->waitForText('HEALTH AND SAFETY', 15, '.filters-bar');
    $I->canSeeLink(\ContentConfig::getGiftData('title'));

    $I->amGoingTo('Reset filters');
    $I->expect('To see test gift');
    $I->click('All', '.filters-bar');
    $I->waitForText('HEALTH AND SAFETY', 15, '.filters-bar');
    $I->canSeeLink(\ContentConfig::getGiftData('title'));
  }

  /**
   * Open gift page and make sure core functions are working.
   *
   * @param \Step\Acceptance\FrontendTester $I
   */
  public function giftPage(FrontendTester $I) {
    $currency = $I->getCurrency();
    $gift = \ContentConfig::getGiftData();

    $I->amGoingTo('Visit frontpage and review ' . $gift['title'] . ' product data.');
    $I->amOnPage('/');

    // Wait until products are loaded.
    $I->waitForText('HEALTH AND SAFETY', 15);

    $I->amGoingTo('Visit gift detailed page.');
    $I->click($gift['title']);

    $I->expectTo('See correct price');
    $I->canSee($gift['price'][$currency]['formatted']);
    $I->expectTo('See correct annotation');
    $I->canSee($gift['annotation']);
    $I->canSee($gift['description']);

    // Test "Add to basket" button.
    $I->clickAddToBasket();
    // Test "Buy now" button.
    $I->clickBuyNow('.tile--text-section--primary');

    $I->expectTo('See Shopping Basket with two items of test product added');
    $I->canSee('Shopping Basket');
    $I->canSee($gift['title']);
    $I->canSee($gift['price'][$currency]['formatted']);
    $I->canSeeInPageSource('<span class="quantity">2</span>');
  }
}
