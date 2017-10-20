<?php
namespace shared\frontend;
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
   * @param \AcceptanceTester $I
   */
  public function frontPage(FrontendTester $I) {
    $region = $I->getRegion();
    $phone_number = ($region == 'gb') ? '1111 111 1111' : '(11) 111 1111';

    $I->amGoingTo('Visit frontpage and check all basic elements are available immediately after page load.');
    $I->amOnPage('/');

    // Phone.
    $I->canSeeLink("Order by Phone $phone_number");
    // Logo.
    $I->canSeeElement('.site-logo');
    // Language switcher.
    $I->canSeeElement('.lang-switcher');
    // Banner.
    $I->canSeeElement('.featured-image');
    // Basket widget.
    $I->canSeeElement('.cart-btn a[href="/basket"] span.count');
    // Products.
    $I->canSee($I->getGiftData('title'));
    // Footer.
    $I->canSee("Need support? Call $phone_number");
    // Server side rendering.
    $I->canSeeInPageSource('<script>window.__INITIAL_STATE__ = {"admin"');
  }

  /**
   * Test router.
   *
   * @param \AcceptanceTester $I
   *
   * Skip this test until main menu content has been confirmed.
   * @skip
   */
  public function mainMenu(FrontendTester $I) {
    $menu_items = [
      'Corporate Gifts' => 'Corporate Gifts - Give the gift of hope to children this year',
      'FAQs' => 'Frequently Asked Questions',
      'How Gifts Work' => 'How do Gifts help?',
      'Contact' => 'For all general queries',
      'Browse Gifts' => 'HEALTH AND SAFETY',
    ];

    $I->amGoingTo('Visit all pages in main menu');
    $I->amOnPage('/');

    foreach ($menu_items as $link => $content) {
      $I->click($link);
      $I->waitForText($content, 15);
    }
  }
}
