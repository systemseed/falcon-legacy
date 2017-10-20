<?php

namespace Routes\v1;

use Slim\App;
use Slim\Container;
use Routes\DrupalRoute;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

/**
 * Class Product
 *
 * Dummy example of a simply proxy route.
 * @package Routes
 */
class Donations extends DrupalRoute {
  /**
   *
   * Platform app name.
   *
   * @var string
   */
  public static $endpoint_name = 'backend-donations';

  /**
   * @inheritdoc
   */
  public static function routes(App $app) {
    $app->group('/donations', function () use ($app) {
      // Start to list any API endpoints here.

      // JSON API endpoints.
      $app->group('/jsonapi', function () use ($app) {
        // Proxy to the backend.
        $app->get('[/{params:.*}]', Donations::class . ':jsonApiProxy');

        $app->post('[/{params:.*}]', Donations::class . ':jsonApiProxy');

        $app->patch('[/{params:.*}]', Donations::class . ':jsonApiProxy');
      });

      // oauth endpoints.
      $app->group('/oauth', function () use ($app) {
        $app->post('[/{params:.*}]', Donations::class . ':oauthProxy');
      });

      // Data model endpoints.
      $app->group('/data-model', function () use ($app) {
        // Proxy to the backend.
        $app->get('[/{params:.*}]', Donations::class . ':dataModelProxy');
      });

      // Custom checkount endpoint.
      $app->post('/cw/checkout/gifts', Donations::class . ':proxy')
        ->setArgument('proxy_path', '/cw/checkout/gifts');

      // Internal auth token endpoint for backend-to-backend communication.
      $app->post('/internal/oauth/token', Donations::class . ':proxy')
        ->setArgument('proxy_path', '/oauth/token');


      // TODO: Drupal X-CSRF-Token endpoint.
    });
  }

  /**
   * Product constructor.
   *
   * Init Guzzle client.
   *
   * @param \Slim\Container $container
   */
  public function __construct(Container $container) {
    parent::__construct($container);
    $this->initializeClientByAppName(self::$endpoint_name);
  }

  /**
   * Custom proxy method with Data Model support for Drupal.
   *
   * @param \Psr\Http\Message\ServerRequestInterface $request
   * @param \Psr\Http\Message\ResponseInterface $response
   * @param $args
   *
   * @see SimpleProxyTrait::proxy().
   *
   * @return ResponseInterface
   */
  public function oauthProxy(ServerRequestInterface $request, ResponseInterface $response, $args) {
    $endpoint = $this->settings['endpoints'][self::$endpoint_name];

    $body = $request->getBody();
    $body_text = $body->__toString();
    $body_text .= '&grant_type=password';
    $body_text .= '&client_id=' . $endpoint['oauth']['client_id'];
    $body_text .= '&client_secret=' . $endpoint['oauth']['client_secret'];
    $body->write($body_text);
    $request->withBody($body);

    return parent::oauthProxy($request, $response, $args);
  }
}
