<?php
/**
 * @file
 */
namespace Routes;

use Interop\Container\ContainerInterface;
use Middleware\PlatformConfigMiddleware;
use Psr\Log\LoggerInterface;
use \Slim\App;
use \GuzzleHttp\Client;

/**
 * Interface Route
 *
 * Every route class should implement this interface when providing a route.
 * @package src\Routes
 */
abstract class Route {

  /**
   * @var $client
   */
  protected $client;

  /**
   * @var ContainerInterface
   */
  protected $container;

  /**
   * @var LoggerInterface
   */
  protected $logger;

  public function __construct(ContainerInterface $container) {
    $this->container = $container;
    $this->logger = $container->get('logger');
  }

  /**
   * Provides route mapping for Slim to use.
   *
   * This allows the routing engine to receive which routes this class provides
   * although not strictly enforced the naming convention of the routes should
   * try and folow the class name.
   *
   * @param App $app
   */
  abstract public static function routes(App $app);

  /**
   * Initialize guzzle client by app name from settings file.
   *
   * @param string $endpoint_name
   * @throws \Exception
   */
  public function initializeClientByAppName(string $endpoint_name) {
    if (empty($this->container->get('settings')['endpoints'][$endpoint_name]['url'])) {
      $this->logger->critical('Cannot find endpoint URL by name', ['name' => $endpoint_name]);
      throw new \Exception('Cannot find endpoint URL by name ' . $endpoint_name);
    }
    $this->initializeClient($this->container->get('settings')['endpoints'][$endpoint_name]);
  }

  /**
   * Initialize guzzle client.
   *
   * Helper function to set up the client using the specified base_uri.
   * Override this if you require additional options passed to Guzzle.
   * @param array $endpoint
   *   Endpoint configuration, the URL key is required
   *
   * @throws \Exception
   */
  public function initializeClient(array $endpoint) {
    $client_ip = !empty($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : $_SERVER['REMOTE_ADDR'];

    if (!empty($endpoint['url'])) {
      $connection_config = [
        'base_uri' => $endpoint['url'],
        'headers' => [
          'User-Agent' => 'Api-Bus',
          // Pass real user IP.
          'X-Forwarded-For' => $client_ip,
          // This host will be used as Drupal base url instead of internal.
          'X-Forwarded-Host' => $endpoint['public_host'],
          // See Drupal consumer module for details about this header.
          'X-Consumer-ID' => $endpoint['consumer_id'],
          'X-Forwarded-CF-IPCountry' => PlatformConfigMiddleware::getCloudflareCountry(),
        ],
      ];

      $this->client = new Client($connection_config);
    }
    else {
      throw new \Exception("Empty URL");
    }
  }

  /**
   * Return reference to an initialised \GuzzleHttp\Client.
   *
   * The initilizeClient should first be called in the constructor so that the
   * GuzzleClient is configured.
   *
   * @return \GuzzleHttp\Client;
   */
  public function getClient() {
    return $this->client;
  }
}
