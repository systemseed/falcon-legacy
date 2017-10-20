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

    if ($platform_routes = self::getRoutes()) {
      // Prepare endpoints array for modification.
      $endpoints = $this->settings['endpoints'];

      foreach ($platform_routes as $url => $route) {
        $proto = substr($route['original_url'], 0, 6);
        if (!empty($route['upstream']) && $proto === 'https:') {
          // The upstream name will be the same as the upstream name in the
          // routes.yml except it won't include the :http or :https part.
          // I.e. backend-donations:http is backend-donations in the
          // PLATFORM_ROUTES var.
          $endpoints[$route['upstream']]['url'] = $url;
        }
      }
      // Write whole array back to avoid "Indirect modification of overloaded
      // element" PHP notice.
      $this->settings['endpoints'] = $endpoints;
    }

    if (!empty($_ENV['PLATFORM_BRANCH']) && $_ENV['PLATFORM_BRANCH'] != 'master') {
      $this->settings['displayErrorDetails'] = TRUE;
    }

    $response = $next($request, $response);
    return $response;
  }
}
