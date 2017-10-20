<?php

namespace Drupal\cw_gifts_api;

/**
 * Generic HTTP client for communication between CW backends.
 *
 * TODO: move to cw_api and make reusable on donations backend.
 *
 * @package Drupal\cw_gifts_api
 */
class InternalClient {

  /* @var string backend name */
  protected $backendName;

  /* @var \GuzzleHttp\Client  */
  protected $client;

  /* @var string */
  protected $authToken;

  /**
   * InternalClient constructor.
   *
   * @param string $backend_name
   *    Backend name for authentication. Example: 'backend-donations'. Can be
   *    empty if requested endpoint does not require authentication.
   * @param string $scope
   *   Access token scope. Can be empty if requested endpoint does not require
   *   authentication.
   */
  public function __construct($backend_name = '', $scope = '') {
    $this->backendName = $backend_name;
    $this->client = $this->initClient();

    // Prepare auth token if backend name is given.
    if ($backend_name) {
      $this->authToken = $this->getAuthToken($backend_name, $scope);
    }
  }

  /**
   * Get API Bus URL.
   *
   * @return string
   *   API Bus URL.
   */
  protected  function getBaseUrl() {
    return \Drupal::config('routes')->get('backend-api-bus')['url'];
  }

  /**
   * Init new Guzzle client.
   *
   * @return \GuzzleHttp\Client
   *   new instance of Guzzle client.
   */
  protected function initClient() {
    // Initialize Guzzle client.
    return \Drupal::service('http_client_factory')->fromOptions([
      'base_uri' => $this->getBaseUrl(),
    ]);
  }

  /**
   * Get auth token for specified backend and scope.
   *
   * @param string $backend_name
   *   Example: backend-donations.
   * @param string $scope
   *   Example: gifts_manager.
   *
   * @return string
   *   Auth token.
   */
  protected function getAuthToken($backend_name, $scope) {
    $state_key = 'cw_api.auth_token.' . $backend_name;
    $storedToken = \Drupal::state()->get($state_key);

    // Return existing token if it's not expired.
    if ($storedToken) {
      if ($storedToken['expires'] > REQUEST_TIME) {
        return $storedToken['access_token'];
      }
    }

    $credentials = \Drupal::config('routes')->get($backend_name);
    if (empty($credentials['client_id'])) {
      return '';
    }

    // Fetch internal token.
    $response = $this->request('POST', '/v1/donations/internal/oauth/token', [
      'form_params' => [
        'grant_type' => 'client_credentials',
        'client_id' => $credentials['client_id'],
        'client_secret' => $credentials['client_secret'],
        'scope' => $scope,
      ],
    ]);

    $data = \GuzzleHttp\json_decode($response->getBody(), TRUE);

    if ($data['access_token']) {

      // Store token in state.
      $data['expires'] = REQUEST_TIME + $data['expires_in'];
      \Drupal::state()->set($state_key, $data);

      return $data['access_token'];
    }

    return '';

  }

  /**
   * Make request of type.
   *
   * @param string $type
   *   HTTP request type: GET, POST, PATCH, DELETE, etc.
   * @param string $path
   *   Endpoint path.
   * @param array $guzzle_options
   *   Any Guzzle options.
   *
   * @return \Psr\Http\Message\ResponseInterface
   *   Guzzle response.
   */
  public function request($type, $path, $guzzle_options = []) {

    if ($this->authToken) {
      $guzzle_options['headers']['Authorization'] = 'Bearer ' . $this->authToken;
    }

    return $this->client->request($type, $path, $guzzle_options);
  }

  /**
   * Make GET request to JSON endpoint.
   *
   * For other types of request / formats use generic request() method.
   *
   * @param string $path
   *   Endpoint path.
   * @param array $guzzle_options
   *   Any Guzzle options.
   *
   * @return array
   *   Response data.
   */
  public function get($path, $guzzle_options = []) {
    $response = $this->request('GET', $path, $guzzle_options);
    return \GuzzleHttp\json_decode($response->getBody(), TRUE);
  }

}
