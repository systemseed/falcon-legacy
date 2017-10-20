<?php

use \Step\Api\JsonApiTester;

/**
 * Class UserEndpointCest
 *
 * Test built-in JSON API users endpoint.
 */
class UsersGetEndpointCest {

  /**
   * @param JsonApiTester $I
   */
    public function getAllUsersAsAnonymous(JsonApiTester $I) {
      $I->amGoingTo('Send GET request to /jsonapi/user/user as anonymous user.');
      $I->sendGET('/jsonapi/user/user', ['_format' => 'api_json']);

      $I->expectTo('See JSON response with 200 OK code.');
      $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
      $I->seeResponseIsJson();

      $I->expectTo('See empty data array');
      $I->seeResponseContains('{"data":[]');

      $I->expect('Not to see administrator.test user data');
      $I->dontSeeResponseContainsJson([
        "name" => "administrator.test",
        "mail" => "falcon.administrator-test@systemseed.com",
      ]);
    }

  /**
   * @param JsonApiTester $I
   */
  public function getAllUsers(JsonApiTester $I) {
    $I->cookieLogin('administrator.test');

    $I->amGoingTo('Send GET request to /jsonapi/user/user endpoint without extra params.');
    $I->sendGET('/jsonapi/user/user', ['_format' => 'api_json']);

    $I->expectTo('See JSON response with 200 OK code.');
    $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
    $I->seeResponseIsJson();

    $I->expectTo('See administrator.test user in the output.');
    $I->seeResponseContainsJson([
      "name" => "administrator.test",
      "mail" => "falcon.administrator-test@systemseed.com",
    ]);
  }

  /**
   * @param JsonApiTester $I
   */
  public function getActiveUsers(JsonApiTester $I) {
    $I->cookieLogin('administrator.test');

    $I->amGoingTo('Send GET request to /jsonapi/user/user endpoint and filter active users only.');
    $I->sendGET('/jsonapi/user/user', [
      '_format' => 'api_json',
      'filter[status][value]' => '1',
    ]);

    $I->expectTo('See JSON response with 200 OK code.');
    $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
    $I->seeResponseIsJson();

    $I->expectTo('See administrator.test user in the output.');
    $I->seeResponseContainsJson([
      "name" => "administrator.test",
      "mail" => "falcon.administrator-test@systemseed.com",
    ]);

    $I->expect('Not to see blocked users in the output.');
    $I->dontSeeResponseContainsJson(['status' => '0']);

    $I->expect('Not to see any meta errors in response.');
    $I->dontSeeResponseContains('"meta":{"errors":');
  }

  /**
   * @param JsonApiTester $I
   */
  public function getActiveUsersWithRoles(JsonApiTester $I) {
    $I->cookieLogin('administrator.test');

    $I->amGoingTo('Send GET request to /jsonapi/user/user endpoint, filter active users only and include user roles ids into the output.');
    $I->sendGET('/jsonapi/user/user', [
      '_format' => 'api_json',
      'filter[status][value]' => '1',
      'include' => 'roles',
      'fields[user_role--user_role]' => 'id,label',
    ]);

    $I->expectTo('See JSON response with 200 OK code.');
    $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
    $I->seeResponseIsJson();

    $I->expectTo('See administrator.test user in the output.');
    $I->seeResponseContainsJson([
      "name" => "administrator.test",
      "mail" => "falcon.administrator-test@systemseed.com",
    ]);

    $I->expect('Not to see blocked users in the output.');
    $I->dontSeeResponseContainsJson(['status' => '0']);

    $I->expect('Not to see any meta errors in response.');
    $I->dontSeeResponseContains('"meta":{"errors":');

    $I->expectTo('See roles data included into the response.');
    $I->seeResponseContains('"included":[{"type":"user_role--user_role"');
    $I->expectTo('Ssee id and label of Administrator role in the output.');
    $I->seeResponseContainsJson([
      'attributes' => [
        'id' => 'administrator',
        'label' => 'Administrator',
      ]
    ]);
  }

  /**
   * @param JsonApiTester $I
   */
  public function getAllUsersIncorrectFormat(JsonApiTester $I) {
    $I->cookieLogin('administrator.test');

    $I->amGoingTo('Send invalid GET request to /jsonapi/user/user endpoint with missing _format param.');
    $I->sendGET('/jsonapi/user/user');

    $I->expect('Not to see 200 OK status code.');
    $I->dontSeeResponseCodeIs(\Codeception\Util\HttpCode::OK);
    $I->expect('Not to see JSON API output.');
    $I->dontSeeResponseContains('{"data":');
  }
}
