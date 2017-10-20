<?php
namespace Routes\v1;

use Routes\DrupalRoute;
use Slim\App;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

class Gifts extends DrupalRoute {

  /**
   * Platform app name.
   *
   * @var string
   */
  public static $endpoint_name = 'backend-gifts';

  /**
   * Product constructor.
   *
   * Init Guzzle client.
   *
   * @param \Slim\Container $container
   */
  public function __construct(\Interop\Container\ContainerInterface $container) {
    parent::__construct($container);

    $this->initializeClientByAppName(self::$endpoint_name);
  }

  /**
   * @inheritdoc
   */
  public static function routes(App $app) {
    $app->group('/gifts', function () use ($app) {
      // Start to list any API endpoints here.

      // JSON API endpoints.
      $app->group('/jsonapi', function () use ($app) {
        // Proxy to the backend.
        $app->get('[/{params:.*}]', Gifts::class . ':jsonApiProxy');

        $app->post('[/{params:.*}]', Gifts::class . ':jsonApiProxy');

        $app->patch('[/{params:.*}]', Gifts::class . ':jsonApiProxy');
      });
      // Data model endpoints.
      $app->group('/data-model', function () use ($app) {
        // Proxy to the backend.
        $app->get('[/{params:.*}]', Gifts::class . ':dataModelProxy');
      });

      // oauth endpoints.
      $app->group('/oauth', function () use ($app) {
        $app->post('[/{params:.*}]', Gifts::class . ':oauthProxy');
      });

      // TODO: Drupal login / logout endpoints.

      // Csrf token endpoint.
      $app->group('/rest', function () use ($app) {
        $app->get('[/{params:.*}]', Gifts::class . ':restProxy');
      });

      // Contact message endpoint.
      $app->group('/contact_message', function () use ($app) {
        $app->post('[/{params:.*}]', Gifts::class . ':contactProxy');
      });

    });
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
