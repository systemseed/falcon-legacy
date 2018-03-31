<?php
namespace Middleware;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Slim\App;

/**
 * Class PlatformConfigMiddleware.
 *
 * Platform.sh configuration parser.
 *
 * @package Middleware
 */
class PlatformConfigMiddleware {
  /**
   * Settings array.
   * @var array
   */
  private $settings;

  /**
   * PlatformConfigMiddleware constructor.
   *
   * Gets the ref to the settings array.
   *
   * @param App $app
   *
   */
  public function __construct(App $app) {
    $this->settings = $app->getContainer()->get('settings');
  }

  /**
   * Get Platform routes.
   *
   * @return array|false
   */
  public static function getRoutes() {
    if (!empty($_ENV['PLATFORM_ROUTES'])) {
      return json_decode(base64_decode($_ENV['PLATFORM_ROUTES']), TRUE);
    }

    return FALSE;
  }

  /**
   * Get correct origin array from Platform route. Currently, Gifts only.
   *
   * @return array|bool
   */
  public static function getOrigin() {
    $origin = [];

    $frontend_urls = [
      'http://www.{default}/',
      'https://www.{default}/',
    ];

    if ($platform_routes = self::getRoutes()) {
      foreach ($platform_routes as $url => $route) {
        if (in_array($route['original_url'], $frontend_urls)) {
          $origin[] = rtrim($url, "/");
        }
      }
    }

    return $origin;
  }

  /**
   * PlatformConfigMiddleware middleware invokable class.
   *
   * @param \Psr\Http\Message\ServerRequestInterface $request
   * @param \Psr\Http\Message\ResponseInterface $response
   * @param callable $next
   * @return \Psr\Http\Message\ResponseInterface
   */
  public function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next) {

    // Prepare endpoints array for modification.
    $endpoints = $this->settings['endpoints'];

    // Use internal Platform.sh network to speed up requests.
    $endpoints['backend-donations']['url'] = 'http://be_donations.internal';
    $endpoints['backend-gifts']['url'] = 'http://be_gifts.internal';

    // Expose consumer ids for each backend.
    $endpoints['backend-donations']['consumer_id'] = $_ENV['DONATIONS_CONSUMER_ID'];
    $endpoints['backend-gifts']['consumer_id'] = $_ENV['GIFTS_CONSUMER_ID'];

    // Expose oauth keys for each backend. CURRENTLY IS NOT USED.
    $endpoints['backend-donations']['oauth'] = [
      'client_id' => $_SERVER['DONATIONS_CLIENT_ID'],
      'client_secret' => $_SERVER['DONATIONS_CLIENT_SECRET'],
    ];
    $endpoints['backend-gifts']['oauth'] = [
      'client_id' => $_SERVER['GIFTS_CLIENT_ID'],
      'client_secret' => $_SERVER['GIFTS_CLIENT_SECRET'],
    ];

    // Write whole array back to avoid "Indirect modification of overloaded
    // element" PHP notice.
    $this->settings['endpoints'] = $endpoints;

    if (!empty($_ENV['PLATFORM_BRANCH']) && $_ENV['PLATFORM_BRANCH'] != 'master') {
      $this->settings['displayErrorDetails'] = TRUE;
    }

    $response = $next($request, $response);
    return $response;
  }

}
