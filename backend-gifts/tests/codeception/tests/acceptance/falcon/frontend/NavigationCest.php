<?php
namespace falcon;
use Step\Acceptance\FrontendTester;


/**
 * Class NavigationCest
 * @package shared\frontend
 *
 * @env chrome
 * @group frontend-gifts
 */
class NavigationCest
{

  /**
   * Test basic site elements.
   *
   * @param FrontendTester $I
   */
  public function frontPage(FrontendTester $I) {

    $I->amGoingTo('Visit frontpage and check all basic elements are available immediately after page load.');
    $I->amOnPage('/');

    // Top bar.
    $I->canSeeElement('.top-bar');
    // Logo.
    $I->canSeeElement('.site-logo');
    // Banner.
    $I->canSeeElement('.featured-image');
    // Basket widget.
    $I->canSeeElement('.cart-btn a[href="/basket"] span.count');
    // Products.
    $I->canSee(\ContentConfig::getGiftData('title'));
    // Footer.
    $I->canSee('Need support?', '.footer');
    // Server side rendering.
    $I->canSeeInPageSource('<script>window.__INITIAL_STATE__ = {"app"');
  }
}
