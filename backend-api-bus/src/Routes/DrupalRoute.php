<?php
/**
 * Created by PhpStorm.
 * User: kalabro
 * Date: 06.03.2017
 * Time: 15:33
 */

namespace Routes;

use GuzzleHttp\Exception\ClientException;
use Interop\Container\ContainerInterface;
use Slim\Container;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

/**
 * Class DrupalRoute
 *
 * Abstract class with generic Drupal & JSON API customisations.
 *
 * @package Routes
 */
abstract class DrupalRoute extends Route {
  use SimpleProxyTrait {
    proxy as protected parentProxy;
  }

  /**
   * Settings array.
   * @var array
   */
  protected $settings;

  /**
   * Product constructor.
   *
   * Init Guzzle client.
   *
   * @param \Slim\Container $container
   */
  public function __construct(Container $container) {
    parent::__construct($container);
    $this->settings = $container->get('settings');
  }

  /**
   * Generic proxy.
   *
   * @param \Psr\Http\Message\ServerRequestInterface $request
   * @param \Psr\Http\Message\ResponseInterface $response
   * @param $args
   * @return \Psr\Http\Message\ResponseInterface
   */
  public function proxy(ServerRequestInterface $request, ResponseInterface $response, $args) {
    // Proxy all query params.
    $args['proxy_options'] = ['query' => $request->getQueryParams()];

    // Call proxy method from SimpleProxyTrait.
    return $this->parentProxy($request, $response, $args);
  }

  /**
   * Custom proxy method with JSON API support for Drupal.
   *
   * @param \Psr\Http\Message\ServerRequestInterface $request
   * @param \Psr\Http\Message\ResponseInterface $response
   * @param $args
   *
   * @see SimpleProxyTrait::proxy().
   *
   * @return ResponseInterface
   */
  public function jsonApiProxy(ServerRequestInterface $request, ResponseInterface $response, $args) {
    // Map full /jsonapi/* path.
    $args['proxy_path'] = '/jsonapi/' . $request->getAttribute('params');

    // Proxy all query params.
    $args['proxy_options'] = ['query' => $request->getQueryParams()];

    // Call proxy method from SimpleProxyTrait.
    return $this->parentProxy($request, $response, $args);
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
  public function dataModelProxy(ServerRequestInterface $request, ResponseInterface $response, $args) {
    // Map full /data-model/* path.
    $args['proxy_path'] = '/data-model/' . $request->getAttribute('params');

    // Proxy all query params.
    $args['proxy_options'] = ['query' => $request->getQueryParams()];
    if (empty($args['proxy_options']['_format'])) {
      $args['proxy_options']['query']['_format'] = 'schema_json';
    }
    if (empty($args['proxy_options']['_describes'])) {
      $args['proxy_options']['query']['_describes'] = 'api_json';
    }

    // Call proxy method from SimpleProxyTrait.
    return $this->parentProxy($request, $response, $args);
  }

  /**
   * Custom proxy method with Auth support for Drupal.
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
    // Map full /oauth/* path.
    $args['proxy_path'] = '/oauth/' . $request->getAttribute('params');

    // Call proxy method from SimpleProxyTrait.
    $resp = $this->parentProxy($request, $response, $args);
    $resp = $resp->withHeader('Content-Type', 'application/vnd.api+json');
    return $resp;
  }

  /**
   * Custom proxy method with Rest support for Drupal.
   *
   * @param \Psr\Http\Message\ServerRequestInterface $request
   * @param \Psr\Http\Message\ResponseInterface $response
   * @param $args
   *
   * @see SimpleProxyTrait::proxy().
   *
   * @return ResponseInterface
   */
  public function restProxy(ServerRequestInterface $request, ResponseInterface $response, $args) {

    // Map full /oauth/* path.
    $args['proxy_path'] = '/rest/' . $request->getAttribute('params');

    $resp = $this->parentProxy($request, $response, $args);
    return $resp;
  }

  /**
   * Custom proxy method for Falcon features.
   *
   * @param \Psr\Http\Message\ServerRequestInterface $request
   * @param \Psr\Http\Message\ResponseInterface $response
   * @param $args
   *
   * @see SimpleProxyTrait::proxy().
   *
   * @return ResponseInterface
   */
  public function falconFeaturesProxy(ServerRequestInterface $request, ResponseInterface $response, $args) {

    // Map full /oauth/* path.
    $args['proxy_path'] = '/falcon/' . $request->getAttribute('params');

    try {
      $resp = $this->parentProxy($request, $response, $args);
    }
    catch (ClientException $e) {
      // Drupal returns 404 if feature is disabled or not available for this user.
      // Return empty response in this case. The client should know how to handle this case.
      if ($e->getCode() === 404) {
        $resp = $response->withStatus(204);
        $this->logger->error('Falcon endpoint returned status 404.', ['url' => (string) $e->getRequest()->getUri()]);
        return $resp;
      }

      throw $e;
    }

    return $resp;
  }

  /**
   * Custom proxy method with Contact form support for Drupal.
   *
   * @param \Psr\Http\Message\ServerRequestInterface $request
   * @param \Psr\Http\Message\ResponseInterface $response
   * @param $args
   *
   * @see SimpleProxyTrait::proxy().
   *
   * @return ResponseInterface
   */
  public function contactProxy(ServerRequestInterface $request, ResponseInterface $response, $args) {

    // Map full /oauth/* path.
    $args['proxy_path'] = '/contact_message/' . $request->getAttribute('params');

    $resp = $this->parentProxy($request, $response, $args);
    return $resp;
  }

}
