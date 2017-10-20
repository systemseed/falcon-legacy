<?php
namespace Step\Acceptance;

class DrupalTester extends \AcceptanceTester
{

  /**
   * Step to login user via standard Drupal form.
   *
   * @param string $name
   * @param string $password
   */
  public function login($name, $password = 'pass123') {
    $I = $this;
    $I->amGoingTo("Login as $name");
    $I->amGoingTo('Submit login form');
    $I->amOnPage('/user');
    $I->fillField('name', $name);
    $I->fillField('pass', $password);
    $I->click('#edit-submit');

    $I->expectTo('be logged in');
    $I->seeLink('Log out');
  }

  /**
   * Step to logout from Drupal site.
   */
  public function logout() {
    $I = $this;
    $I->amGoingTo('Logout from the site');
    $I->amOnPage('/user/logout');
    $I->dontSeeLink('Log out');
  }
}
