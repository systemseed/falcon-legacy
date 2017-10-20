<?php
namespace Step\Api;

use \Codeception\Util\HttpCode;

/**
 * Class JsonApiTester
 *
 * JSON API specific tester with common methods.
 */
class JsonApiTester extends \ApiTester {

  /**
   * Login to Drupal via standard user/login endpoint.
   *
   * @param $name
   * @param string $password
   */
  public function cookieLogin($name, $password = 'password') {
    $I = $this;
    $I->amGoingTo('Send POST request to user/login endpoint.');
    $I->haveHttpHeader('Content-Type', 'application/json');
    $I->sendPOST('/user/login?_format=json', [
      'name' => $name,
      'pass' => $password,
    ]);

    $I->expectTo('See JSON response with 200 OK code.');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();


    $I->seeResponseContainsJson([
      'name' => $name
    ]);
  }

}
