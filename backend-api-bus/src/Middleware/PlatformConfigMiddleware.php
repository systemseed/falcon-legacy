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
      'http://{default}/',
      'https://{default}/',
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
   * Returns host name by Platform.sh URL template.
   *
   * @param string $template
   *
   * @return mixed
   */
  public static function getHostByTemplate($template) {
    if ($platform_routes = self::getRoutes()) {
      foreach ($platform_routes as $url => $route) {
        if ($route['original_url'] == $template) {
          return parse_url($url, PHP_URL_HOST);
        }
      }
    }

    return FALSE;
  }

  /**
   * Get suggested user country from Cloudflare CDN.
   *
   * @return string
   */
  public static function getCloudflareCountry() {

    // In Production mode use Cloudflare header.
    // Read more: https://support.cloudflare.com/hc/en-us/articles/200168236-What-does-Cloudflare-IP-Geolocation-do-
    if ($_ENV['PLATFORM_BRANCH'] === 'master') {
      return !empty($_SERVER['HTTP_CF_IPCOUNTRY']) ? $_SERVER['HTTP_CF_IPCOUNTRY'] : '';
    }

    // Test mode.
    return getenv('TEST_HTTP_CF_IPCOUNTRY') ? getenv('TEST_HTTP_CF_IPCOUNTRY') : '';
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

    if (!empty($_ENV['PLATFORM_BRANCH'])) {

      // Prepare endpoints array for modification.
      $endpoints = $this->settings['endpoints'];

      // Use internal Platform.sh network to speed up requests.
      $endpoints['backend-donations']['url'] = 'http://be_donations.internal';
      $endpoints['backend-gifts']['url'] = 'http://be_gifts.internal';

      // Expose public host to pass in X-Forwarded-Host header.
      $endpoints['backend-donations']['public_host'] = self::getHostByTemplate('https://donations.api.{default}/');
      $endpoints['backend-gifts']['public_host'] = self::getHostByTemplate('https://gifts.api.{default}/');

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

      if ($_ENV['PLATFORM_BRANCH'] != 'master') {
        $this->settings['displayErrorDetails'] = TRUE;
      }
    }
    $response = $next($request, $response);
    return $response;
  }

}
