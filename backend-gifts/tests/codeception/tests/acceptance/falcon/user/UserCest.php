<?php

use Step\Acceptance\DrupalTester as Tester;

class UserCest
{

  /**
   * @param \Step\Acceptance\DrupalTester $I
   *
   * @env phantom
   * @env phantom-circle
   */
  public function loginAsGiftsManager(Tester $I) {
    $I->amGoingTo('Login as Gifts Manager and see admin toolbar');
    $I->login('gifts_manager.test', 'password');
  }

}
