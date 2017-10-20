<?php
namespace Routes;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Class SimpleProxyTrait
 *
 * Provides a simply proxy trait to apply to any class where developer does not
 * want to repeat the same proxy code.
 *
 * @package Routes
 */
trait SimpleProxyTrait {

  /**
   * Generic proxy method.
   *
   * Will proxy to appropriate method according to the method requested.
   *
   * @param \Psr\Http\Message\ServerRequestInterface $request
   * @param \Psr\Http\Message\ResponseInterface $response
   * @param $args
   *
   * @return ResponseInterface
   */
  public function proxy(ServerRequestInterface $request, ResponseInterface $response, $args) {

    switch ($request->getMethod()) {
      case 'GET':
        return $this->proxyGet($request, $response, $args);

      case 'POST':
        return $this->proxyPostPatch('POST', $request, $response, $args);

      case 'PATCH':
        return $this->proxyPostPatch('PATCH', $request, $response, $args);
    }
  }

  /**
   * Simple proxy get.
   *
   * Will proxy a get request to proxy_path.
   *
   * @param \Psr\Http\Message\ServerRequestInterface $request
   * @param \Psr\Http\Message\ResponseInterface $response
   * @param $args
   *    Expected proxy_path to be a key in this array.
   * @return \Psr\Http\Message\ResponseInterface
   */
  public function proxyGet(ServerRequestInterface $request, ResponseInterface $response, $args) {
    if (empty($args['proxy_path'])) {
      $args['proxy_path'] = '';
    }

    if (empty($args['proxy_options'])) {
      $args['proxy_options'] = [];
    }

    $raw_headers = $request->getHeaders();
    $headers = [];
    if (!empty($raw_headers['HTTP_AUTHORIZATION'][0])) {
      $headers['Authorization'] = $raw_headers['HTTP_AUTHORIZATION'][0];
    }
    $args['proxy_options']['headers'] = $headers;

    //throw new \Exception(print_r($args['proxy_options'], TRUE));
    /* @var \GuzzleHttp\Client $client */
    $client = $this->getClient();
    $proxy_request = $client->request('GET', $args['proxy_path'], $args['proxy_options']);
    $response->getBody()->write((string) $proxy_request->getBody());

    // Example of header proxy.
    if ($proxy_request->hasHeader('Content-Type')) {
      $response = $response->withHeader('Content-Type', $proxy_request->getHeader('Content-Type'));
    }

    return $response;
  }

  /**
   * Simple proxy post.
   *
   * Will proxy a post with header and body to proxy_path.
   *
   * @param \Psr\Http\Message\ServerRequestInterface $request
   * @param \Psr\Http\Message\ResponseInterface $response
   * @param $args
   *    Expected proxy_path to be a key in this array.
   * @return \Psr\Http\Message\ResponseInterface
   */
  public function proxyPostPatch($method, ServerRequestInterface $request, ResponseInterface $response, $args) {
    if (empty($args['proxy_path'])) {
      $args['proxy_path'] = '';
    }

    if (empty($args['proxy_options'])) {
      $args['proxy_options'] = [];
    }

    $client = $this->getClient();

    $raw_headers = $request->getHeaders();
    // @todo: $request->getHeaders() returns headers in wrong format, eg. it uses 'CONTENT_TYPE' key instead of 'Content-Type',
    // so we can't use it in raw guzzle request.
    // Example: Array ( [HTTP_ACCEPT_LANGUAGE] => Array ( [0] => en,ru;q=0.8,de;q=0.6,en-US;q=0.4 ) [HTTP_ACCEPT_ENCODING] => Array ( [0] => gzip, deflate ) [HTTP_REFERER] => Array ( [0] => http://gifts.flc.local/checkout ) [HTTP_ACCEPT] => Array ( [0] => */* ) [CONTENT_TYPE] => Array ( [0] => application/vnd.api+json ) [HTTP_USER_AGENT] => Array ( [0] => Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36 ) [HTTP_ORIGIN] => Array ( [0] => http://gifts.flc.local ) [HTTP_CACHE_CONTROL] => Array ( [0] => no-cache ) [HTTP_PRAGMA] => Array ( [0] => no-cache ) [HTTP_X_FORWARDED_PROTO] => Array ( [0] => http ) [HTTP_X_FORWARDED_FOR] => Array ( [0] => 172.20.0.1 ) [HTTP_X_REAL_IP] => Array ( [0] => 172.20.0.1 ) [HTTP_CONNECTION] => Array ( [0] => close ) [Host] => Array ( [0] => api.flc.local ) [CONTENT_LENGTH] => Array ( [0] => 194 ) )
    $headers = [];
    if (!empty($raw_headers['CONTENT_TYPE'][0])) {
      $headers['Content-Type'] = $raw_headers['CONTENT_TYPE'][0];
    }
    if (!empty($raw_headers['HTTP_AUTHORIZATION'][0])) {
      $headers['Authorization'] = $raw_headers['HTTP_AUTHORIZATION'][0];
    }
    $args['proxy_options']['body'] = $request->getBody();
    $args['proxy_options']['headers'] = $headers;

    $proxy_request = $client->request($method, $args['proxy_path'], $args['proxy_options']);
    $response->getBody()->write((string) $proxy_request->getBody());
    // Proxy Content-Type header.
    if ($proxy_request->hasHeader('Content-Type')) {
      $response = $response->withHeader('Content-Type', $proxy_request->getHeader('Content-Type'));
    }

    return $response;
  }

}
