<?php

use Step\Acceptance\DrupalTester as Tester;

class UserCest
{

  /**
   * I am able to login as test admin.
   *
   * @param \Step\Acceptance\DrupalTester $I
   *
   * @env phantom
   * @env phantom-circle
   */
//  public function loginAsAdmin(Tester $I) {
//    $I->login('administrator.test', 'pass123');
//    $I->seeLink('Configuration');
//  }

  /**
   * I am able to logout.
   *
   * @param \Step\Acceptance\DrupalTester $I
   *
   * @env phantom-circle
   * @env phantom
   * @depends loginAsAdmin
   */
//  public function logout(Tester $I) {
//    $I->logout();
//
//    $I->amOnPage('user');
//    $I->expectTo('See login form');
//    $I->see('Log in', 'h1');
//  }
}
