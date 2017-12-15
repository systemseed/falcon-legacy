<?php
namespace shared\nodes;

use Step\Api\JsonApiTester;
use Codeception\Util\HttpCode;

/**
 * Class PageCest
 *
 * Test JSON API endpoints for cw_page content type.
 */
class PageCest {

  protected $uuid = '';
  protected $page_title = 'Test from Codeception';
  protected $page_body = [
    'value' => 'Test from <b>Codeception</b>',
    'format' => 'basic_html',
  ];

  /**
   * @param \Step\Api\JsonApiTester $I
   */
  public function getPages(JsonApiTester $I) {

    $I->am('anonymous user');
    $I->amGoingTo('Send GET request to /jsonapi/node/cw_page and get published pages.');

    $I->sendGET('/jsonapi/node/cw_page', [
      '_format' => 'api_json',
      'filter[status][value]' => '1',
    ]);

    $I->expectTo('See JSON response with 200 OK code.');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();
  }

  /**
   * @param \Step\Api\JsonApiTester $I
   */
  public function postPage(JsonApiTester $I) {
    $I->cookieLogin('administrator.test');
    $I->amGoingTo('Use CSRF Token from previous login request.');
    $csrf_token = $I->grabDataFromResponseByJsonPath('$.csrf_token')[0];

    $I->amGoingTo('Send POST request to /jsonapi/node/cw_page and create new page.');

    // Set JSON API header.
    $I->haveHttpHeader('Content-Type', 'application/vnd.api+json');
    // Set security token.
    $I->haveHttpHeader('X-CSRF-Token', $csrf_token);
    // NOTE: _format=api_json is required in URL.
    $I->sendPOST('/jsonapi/node/cw_page?_format=api_json', [
      'data' => [
        'type' => 'node--cw_page',
        'attributes' => [
          'title' => $this->page_title,
          'body' => $this->page_body,
        ]
      ]
    ]);

    $I->expectTo('See JSON response with 201 CREATED code.');
    $I->seeResponseCodeIs(HttpCode::CREATED);
    $I->seeResponseIsJson();

    $I->seeResponseContainsJson([
      'title' => $this->page_title,
    ]);

    $I->seeResponseContainsJson($this->page_body);

    // Save recently created node uuid to reuse in next steps.
    $this->uuid = $I->grabDataFromResponseByJsonPath('$.data.id')[0];
  }

  /**
   * @param \Step\Api\JsonApiTester $I
   *
   * @depends postPage
   */
  public function patchPage(JsonApiTester $I) {
    $edited_body = $this->page_body;
    $edited_body['value'] .= ' Edited from Codeception.';

    $I->cookieLogin('administrator.test');
    $I->amGoingTo('Use CSRF Token from previous login request.');
    $csrf_token = $I->grabDataFromResponseByJsonPath('$.csrf_token')[0];

    $I->amGoingTo("Send PATCH request to /jsonapi/node/cw_page/{$this->uuid} and edit body field of the page.");

    // Set JSON API header.
    $I->haveHttpHeader('Content-Type', 'application/vnd.api+json');
    // Set security token.
    $I->haveHttpHeader('X-CSRF-Token', $csrf_token);
    // NOTE: _format=api_json is required in URL.
    $I->sendPATCH("/jsonapi/node/cw_page/{$this->uuid}?_format=api_json", [
      'data' => [
        'id' => $this->uuid,
        'attributes' => [
          'body' => $edited_body,
        ]
      ]
    ]);

    $I->expectTo('See JSON response with 200 OK code.');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();

    $I->expectTo('See title unchanged');
    $I->seeResponseContainsJson([
      'title' => $this->page_title,
    ]);

    $I->expectTo('See updated body value');
    $I->seeResponseContainsJson($edited_body);

  }

  /**
   * @param \Step\Api\JsonApiTester $I
   *
   * @depends postPage
   */
  public function deletePage(JsonApiTester $I) {
    $I->cookieLogin('administrator.test');
    $I->amGoingTo('Use CSRF Token from previous login request.');
    $csrf_token = $I->grabDataFromResponseByJsonPath('$.csrf_token')[0];

    $I->amGoingTo("Send DELETE request to /jsonapi/node/cw_page/{$this->uuid} and delete recently created page.");

    // Set JSON API header.
    $I->haveHttpHeader('Content-Type', 'application/vnd.api+json');
    // Set security token.
    $I->haveHttpHeader('X-CSRF-Token', $csrf_token);
    // NOTE: _format=api_json is required in URL.
    $I->sendDELETE("/jsonapi/node/cw_page/{$this->uuid}?_format=api_json", '');

    $I->expectTo('See response with 204 NO CONTENT code.');
    $I->seeResponseCodeIs(HttpCode::NO_CONTENT);

  }
}
