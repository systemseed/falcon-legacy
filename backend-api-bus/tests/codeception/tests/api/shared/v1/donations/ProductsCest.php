<?php
namespace shared\v1;
use \ApiTester;
use Codeception\Util\HttpCode;

/**
 * Test suite for /v1/donations/commerce_product endpoint.
 *
 * @package shared\v1
 */
class ProductsCest {
  /**
   * @param \ApiTester $I
   */
  public function getGifts(ApiTester $I) {

    $I->am('anonymous user');
    $I->amGoingTo('Send GET request to /v1/donations/commerce_product/gift and get gifts.');

    $I->sendGET('/v1/donations/jsonapi/commerce_product/gift', [
      'filter[status][value]' => '1',
    ]);

    $I->expectTo('See JSON response with 200 OK code.');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();

    $I->seeHttpHeader('Content-Type', 'application/vnd.api+json');
  }

  /**
   * @param \ApiTester $I
   */
  public function getCorporateGifts(ApiTester $I) {

    $I->am('anonymous user');
    $I->amGoingTo('Send GET request to /v1/donations/commerce_product/gift_corporate and get corporate gifts.');

    $I->sendGET('/v1/donations/jsonapi/commerce_product/gift_corporate', [
      'filter[status][value]' => '1',
    ]);

    $I->expectTo('See JSON response with 200 OK code.');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();

    $I->seeHttpHeader('Content-Type', 'application/vnd.api+json');
  }
}
