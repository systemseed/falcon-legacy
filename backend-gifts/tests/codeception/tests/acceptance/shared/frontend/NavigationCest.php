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
    $phone_number = ($region == 'gb') ? '0800 032 4001' : '1850 458 400';

    $I->amGoingTo('Visit frontpage and check all basic elements are available immediately after page load.');
    $I->amOnPage('/');

    // Phone.
    $I->canSeeLink("Order by Phone $phone_number");
    // Logo.
    $I->canSeeElement('.site-logo');
    // Language switcher.
    // TODO: uncomment when UK gifts site is online.
    // $I->canSeeElement('.lang-switcher');
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
   */
  public function mainMenu(FrontendTester $I) {
    $menu_items = [
      'Corporate Gifts' => 'Concern Corporate Gifts - Give the gift of hope to children this year',
      'FAQs' => 'Frequently Asked Questions',
      'How Gifts Work' => 'How it works',
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
