<?php
namespace shared\v1;
use \ApiTester;
use Codeception\Util\HttpCode;

/**
 * Test suite for example /v1/playlist endpoint.
 *
 * @package shared\v1
 */
class PagesCest {
  /**
   * @param \ApiTester $I
   */
  public function getPages(ApiTester $I) {

    $I->am('anonymous user');
    $I->amGoingTo('Send GET request to /v1/gifts/jsonapi/node/cw_page and get published pages.');

    $I->sendGET('/v1/gifts/jsonapi/node/cw_page', [
      'filter[status][value]' => '1',
    ]);

    $I->expectTo('See JSON response with 200 OK code.');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();

    $I->seeHttpHeader('Content-Type', 'application/vnd.api+json');
  }
}
