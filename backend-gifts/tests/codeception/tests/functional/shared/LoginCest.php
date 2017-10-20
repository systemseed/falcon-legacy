<?php


class LoginCest
{
  /**
   * This example is disabled in favour of acceptance tests with much more
   * flexibility and control.
   *
   * @param \FunctionalTester $I
   */
    private function loginAsAdmin(FunctionalTester $I) {
      $I->am('anonymous user');
      $I->amGoingTo('Submit login form with valid credentials');
      $I->amOnPage('/user');
      $I->fillField('name', 'administrator.test');
      $I->fillField('pass', 'pass123');
      $I->click('#edit-submit');

      $I->expectTo('be authorised as administrator');
      $I->seeLink('Log out');
      $I->seeLink('Configuration');
    }
}
