<?php

namespace Drupal\falcon_thankq;

/**
 * Class ThankqClient.
 *
 * SOAP client to make requests to ThankQ API. Uses built-in PHP SoapClient.
 */
class ThankqClient {

  /**
   * Delay in seconds to set in queries before push to ThankQ,
   * because in some cases data can't be saved properly without it.
   *
   * Some orders have been pushed to ThankQ without issues and returned correct ThankQ ID,
   * but actually they weren't saved properly in ThankQ and can't be fetched by given ID.
   *
   * @see: https://www.pivotaltracker.com/story/show/153174917
   *
   * @var int
   */
  protected $requestDelay;

  /* @var \SoapClient */
  protected $client;

  /* @var bool */
  protected $debugMode;

  /* @var int */
  protected $callId;

  /* @var string */
  protected $instance = '';

  /**
   * ThankqClient constructor.
   */
  public function __construct() {
    // Enable debug mode if Devel is enabled and current user is authenticated.
    $this->debugMode = \Drupal::moduleHandler()
        ->moduleExists('devel') && \Drupal::currentUser()->isAuthenticated();

    // Define Request delay, now it's possible to override it.
    $this->requestDelay = \Drupal::state()->get('falcon_thankq_request_delay') ? : 1;

    // Basic SOAP options.
    $options = [
      'features' => SOAP_SINGLE_ELEMENT_ARRAYS,
      'exceptions' => TRUE,
    ];

    if ($this->debugMode) {
      $options['trace'] = TRUE;
    }

    // Get WSDL URL from configuration.
    // IMPORTANT: Live configuration is stored in settings.php and should be
    // updated when the site goes live.
    $wsdl = \Drupal::config('falcon_thankq.config')->get('wsdl_uri');

    // Get HTTP Auth from URL.
    $url_parts = parse_url($wsdl);
    if ($url_parts['user'] && $url_parts['pass']) {
      // Login / password options are required to make SOAP calls through
      // a protected HTTP proxy.
      $options['login'] = $url_parts['user'];
      $options['password'] = $url_parts['pass'];
    }

    // Initialise built-in SOAP client.
    $this->client = new \SoapClient($wsdl, $options);
    // We have to set location explicitly because WSDL file contains Nginx
    // proxy name instead of the correct URL.
    $this->client->__setLocation($url_parts['scheme'] . '://' . $url_parts['host'] . $url_parts['path']);

    // Set name of ThankQ instance.
    // Example: /TeleServiceCCNDtest/esitWS.asmx?WSDL
    if (preg_match('#TeleService[^/]+#', $url_parts['path'], $matches)) {
      $this->instance = $matches[0];
    }
  }

  public function getInstance() {
    return $this->instance;
  }

  /**
   * Generate new call id to identify SOAP call in remote logs.
   *
   * @return int
   *   New call id.
   */
  protected function setCallId() {
    $this->callId = time();

    return $this->callId;
  }

  /**
   * Debug recent SOAP request.
   *
   * @return array
   *   Array with last request and response data.
   */
  public function debug() {
    if (!$this->debugMode) {
      return [];
    }

    $debug = [
      'getLastRequest' => $this->client->__getLastRequest(),
      'getLastResponse' => $this->client->__getLastResponse(),
    ];

    if (function_exists('dpm')) {
      dpm($debug);
    }

    return $debug;
  }

  /**
   * Create a new contact in ThankQ.
   *
   * See API details here:
   * https://thankq.cwv2.net/TeleServiceCCNDtest/esitWS.asmx?op=doContactInsert.
   *
   * @param array $contact
   *   New contact details.
   *
   * @return bool|string
   *   Serial number.
   *
   * @throws \Exception
   */
  public function doContactInsert(array $contact) {
    $params = [];

    if (empty($contact['keyname'])) {
      throw new \Exception('Contact keyname cannot be empty.');
    }

    $params['contact'] = [
      'firstname' => $contact['firstname'],
      'keyname' => $contact['keyname'],
      // Everything below can be default.
      'titleChanged' => FALSE,
      'firstNameChanged' => FALSE,
      'keyNameChanged' => FALSE,
    ];

    if (!empty($contact['title'])) {
      $params['contact']['title'] = $contact['title'];
    }

    $params['contactAddress'] = [
      'addressLine1' => $contact['addressLine1'],
      'addressLine3' => $contact['addressLine3'],
      'addressLine4' => $contact['addressLine4'],
      'country' => $contact['country'],
      'mobileNumber' => $contact['mobileNumber'],
      'emailAddress' => $contact['emailAddress'],
      // Everything below can be default.
      'dayTelephoneInvalid' => FALSE,
      'eveningTelephoneInvalid' => FALSE,
      'mobileNumberInvalid' => FALSE,
      'addressLine1Changed' => FALSE,
      'addressLine3Changed' => FALSE,
      'addressLine4Changed' => FALSE,
      'postcodeChanged' => FALSE,
      'countryChanged' => FALSE,
      'dayTelephoneChanged' => FALSE,
      'eveningTelephoneChanged' => FALSE,
      'mobileNumberChanged' => FALSE,
      'emailAddressChanged' => FALSE,
      'addressTypeChanged' => FALSE,
      'dayTelephoneInvalidChanged' => FALSE,
      'eveningTelephoneInvalidChanged' => FALSE,
      'mobileNumberInvalidChanged' => FALSE,
    ];
    // Use default.
    $params['contactAttribute'] = [
      'taxStatusChanged' => FALSE,
    ];

    $params['contactDataProtection'] = [
      'doNotMail' => $contact['doNotMail'],
      'doNotPhone' => $contact['doNotPhone'],
      'doNotEmail' => $contact['doNotEmail'],
      'doNotSMS' => $contact['doNotSMS'],
      // Everything below can be default.
      'doNotContact' => FALSE,
      'doNotFax' => FALSE,
      'mailThirdParty' => FALSE,
      'emailThirdParty' => FALSE,
      'phoneThirdParty' => FALSE,
      'faxThirdParty' => FALSE,
      'LimitedComm' => FALSE,
    ];

    $request = ['doContactInsertArgument' => $params];

    try {
      // Set delay before push to ThankQ, because in some cases data can't be saved properly without it.
      sleep($this->requestDelay);

      // Make a SOAP call.
      $response = $this->client->doContactInsert($request);

      if (empty($response) || empty($response->doContactInsertResult)) {
        throw new \Exception('No "doContactInsertResult" in the response.');
      }

      return $response->doContactInsertResult->serialnumber;
    } catch (\Exception $e) {
      watchdog_exception('falcon_thankq', $e);

      if ($this->debugMode) {
        $this->debug();
      }

      // Throw exception further.
      throw $e;
    }
  }

  /**
   * Create a new Gifts order in ThankQ.
   *
   * @param array $order
   *   New order details.
   *
   * @return bool|string
   *   Order number.
   *
   * @throws \Exception
   */
  public function doTradingOrderSet(array $order) {
    $params = [];
    $params['serialnumber'] = $order['serialnumber'];

    $params['order'] = [
      'sourceCode' => $order['sourceCode'],
      'postage' => 0.00,
      'specialInstructions' => $order['specialInstructions'],
      'paymentType' => $order['paymentType'],
      'totalPayment' => $order['totalPayment'],
      'teleHeader' => $order['teleHeader'],
    ];

    $params['products'] = $order['products'];
    $params['callID'] = $this->setCallId();

    $request = ['doTradingOrderSetArgument' => $params];

    try {
      // Set delay before push to ThankQ, because in some cases data can't be saved properly without it.
      sleep($this->requestDelay);

      // Make a SOAP call.
      $response = $this->client->doTradingOrderSet($request);
      if (empty($response) || empty($response->doTradingOrderSetResult)) {
        return new \Exception('No "doTradingOrderSetResult" in the response.');
      }

      return $response->doTradingOrderSetResult->orderId;
    } catch (\Exception $e) {
      watchdog_exception('falcon_thankq', $e);

      if ($this->debugMode) {
        $this->debug();
      }

      // Throw exception further.
      throw $e;
    }
  }

  /**
   * Place a new financial donation in ThankQ.
   *
   * @param array $donation
   *   New donation details.
   *
   * @return string|bool
   *   Donation number.
   */
  public function doDonateMemberInsert($donation) {
    $params = [];

    $params['serialnumber'] = $donation['serialnumber'];
    $params['donation'] = [
      'sourceCode' => $donation['sourceCode'],
      'destinationCode' => 'Gift',
      'amount' => $donation['amount'],
      'GAD' => $donation['GAD'],
      'callid' => $this->setCallId(),
      'paymentType' => $donation['paymentType'],
      'campaignID' => $donation['campaignID'],
      'softCredit' => FALSE,
      'narrative' => $donation['narrative'],
      'notes' => $donation['notes'],
      'receiptRequired' => $donation['receiptRequired'],
    ];

    $request = ['doDonateMemberInsertArgument' => $params];

    try {
      // Set delay before push to ThankQ, because in some cases data can't be saved properly without it.
      sleep($this->requestDelay);

      // Make a SOAP call.
      $response = $this->client->doDonateMemberInsert($request);
      if (empty($response) || empty($response->doDonateMemberInsertResult)) {
        throw new \Exception('No "doDonateMemberInsertResult" in the response.');
      }

      return $response->doDonateMemberInsertResult->donationID;
    } catch (\Exception $e) {
      watchdog_exception('falcon_thankq', $e);

      if ($this->debugMode) {
        $this->debug();
      }

      // Throw exception further.
      throw $e;
    }
  }

  /**
   * Fetch trading data from ThankQ.
   *
   * See details: https://thankq.cwv2.net/TeleServiceCCNDtest/esitWS.asmx?op=doTradingLookup
   * In fact, we can fetch Gifts products only.
   *
   * @return array
   */
  public function doTradingLookup() {
    try {
      // Make a SOAP call.
      $response = $this->client->doTradingLookup();
      if (empty($response) || empty($response->doTradingLookupResult)) {
        throw new \Exception('No "doTradingLookupResult" in the response.');
      }

      return [
        'products' => $response->doTradingLookupResult->products->esitWStradingProduct,
        'sourcecodes' => $response->doTradingLookupResult->sourcecodes,
        'postageOptions' => $response->doTradingLookupResult->postageOptions->esitWStradingPostageOption,
      ];
    } catch (\Exception $e) {
      watchdog_exception('falcon_thankq', $e);

      if ($this->debugMode) {
        $this->debug();
      }

      // Throw exception further.
      throw $e;
    }
  }

  /**
   * Fetch ThankQ order by order id.
   *
   * @param string $order_id
   * @return array|bool
   */
  public function doTradingOrderGet($order_id) {
    $params = [
      'orderId' => $order_id,
    ];

    $request = ['doTradingOrderGetArgument' => $params];

    try {
      // Make a SOAP call.
      $response = $this->client->doTradingOrderGet($request);
      if (empty($response) || empty($response->doTradingOrderGetResult->orders->esitWStradingOrder)) {
        return FALSE;
      }

      return (array) $response->doTradingOrderGetResult->orders->esitWStradingOrder[0];

    } catch (\Exception $e) {
      watchdog_exception('falcon_thankq', $e);

      if ($this->debugMode) {
        $this->debug();
      }

      // Throw exception further.
      throw $e;
    }
  }

  /**
   * Fetch ThankQ contact by serial number.
   *
   * @param string $serial_number
   * @return array|bool
   */
  public function doContactGet($serial_number) {
    $request = ['serialnumber' => $serial_number];

    try {
      // Make a SOAP call.
      $response = $this->client->doContactGet($request);
      if (empty($response) || empty($response->doContactGetResult->serialnumber)) {
        return FALSE;
      }

      return (array) $response->doContactGetResult;

    } catch (\Exception $e) {
      watchdog_exception('falcon_thankq', $e);

      if ($this->debugMode) {
        $this->debug();
      }

      // Throw exception further.
      throw $e;
    }
  }

  /**
   * Fetch ThankQ Gift Aid info by serial number.
   *
   * @param string $serial_number
   * @return array|bool
   */
  public function doGADsGet($serial_number) {
    $request = ['serialnumber' => $serial_number];

    try {
      // Make a SOAP call.
      $response = $this->client->doGADsGet($request);
      if (empty($response) || empty($response->doGADsGetResult->serialnumber)) {
        return FALSE;
      }

      return (array) $response->doGADsGetResult;

    } catch (\Exception $e) {
      watchdog_exception('falcon_thankq', $e);

      if ($this->debugMode) {
        $this->debug();
      }

      // Throw exception further.
      throw $e;
    }
  }

  /**
   * Place a new Gift Aid in ThankQ.
   *
   * @param array $gadParams
   *   Gift Aid details.
   *
   * @return string|bool
   *   Gift Aid number.
   */
  public function doGADInsert($gadParams) {
    $params = [];

    // Prepare current date in correct format.
    $date = date('Y-m-d\TH:i:s', time());

    $params['callID'] = $this->setCallId();
    $params['gadRecord'] = [
      'dateOfDeclaration' => $date,
      'dateOfReply' => NULL,
      'effectiveFromDate' => $date,
      'effectiveToDate' => NULL,
      'maximumvalue' => NULL,
      'created' => $date,
      'modified' => $date,
      'ROITotalValue' => '0.0000',

      'serialNumber' => $gadParams['serialnumber'],
      'title' => $gadParams['title'],
      'firstName' => $gadParams['firstname'],
      'keyName' => $gadParams['keyname'],
      'typeOfDeclaration' => 'Electronic',
      'createdBy' => '',
      'modifiedBy' => '',
      'source' => $gadParams['source'],
    ];

    $request = ['doGADInsertArgument' => $params];

    try {
      // Set delay before push to ThankQ, because in some cases data can't be saved properly without it.
      sleep($this->requestDelay);

      // Make a SOAP call.
      $response = $this->client->doGADInsert($request);
      if (empty($response) || empty($response->doGADInsertResult)) {
        throw new \Exception('No "doGADInsertResult" in the response.');
      }

      return $response->doGADInsertResult->declarationID;
    } catch (\Exception $e) {
      watchdog_exception('falcon_thankq', $e);

      if ($this->debugMode) {
        $this->debug();
      }

      // Throw exception further.
      throw $e;
    }
  }

}
