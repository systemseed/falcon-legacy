<?php

namespace Drupal\commerce_paypal_button\Plugin\Commerce\PaymentGateway;

use Drupal\commerce_payment\Entity\PaymentInterface;
use Drupal\commerce_payment\Entity\PaymentMethodInterface;
use Drupal\commerce_payment\Exception\InvalidResponseException;
use Drupal\commerce_payment\PaymentMethodTypeManager;
use Drupal\commerce_payment\PaymentTypeManager;
use Drupal\commerce_payment\Plugin\Commerce\PaymentGateway\OnsitePaymentGatewayBase;
use Drupal\commerce_payment_example\Plugin\Commerce\PaymentGateway\OnsiteInterface;
use Drupal\commerce_price\Price;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Datetime\TimeInterface;
use PayPal\Api\Payment;
use PayPal\Api\PaymentExecution;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Rest\ApiContext;

/**
 * Provides the Paypal Express Checkout button integration.
 *
 * @CommercePaymentGateway(
 *   id = "paypal_button",
 *   label = "Paypal Button",
 *   display_label = "Paypal",
 *   payment_method_types = {"paypal"},
 * )
 */
class Paypal extends OnsitePaymentGatewayBase implements OnsiteInterface {

  /* @var \PayPal\Rest\ApiContext */
  protected $apiContext;

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entity_type_manager, PaymentTypeManager $payment_type_manager, PaymentMethodTypeManager $payment_method_type_manager, TimeInterface $time) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $entity_type_manager, $payment_type_manager, $payment_method_type_manager, $time);

    // Initialize PayPal SDK.
    $this->initApi($this->configuration['client_id'], $this->configuration['secret_key']);
  }

  /**
   * Prepare PayPal PHP SDK without making any requests yet.
   *
   * @param string $clientId
   *   PayPal clientId.
   * @param string $secret
   *   PayPal secret.
   */
  public function initApi($clientId, $secret) {
    if ($clientId && $secret) {
      $this->apiContext = new ApiContext(
        new OAuthTokenCredential($this->configuration['client_id'], $this->configuration['secret_key'])
      );

      $this->apiContext->setConfig([
        'mode' => $this->configuration['mode'] === 'live' ? 'live' : 'sandbox',
        'log.AdapterFactory' => '\Drupal\commerce_paypal_button\PaypalLogFactory',
        // Use cache file to improve PayPal SDK performance.
        'cache.enabled' => TRUE,
        'cache.FileName' => 'private://paypal/paypal_sdk.auth.cache',
      ]);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'client_id' => '',
      'secret_key' => '',
    ] + parent::defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildConfigurationForm($form, $form_state);

    $form['client_id'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Client ID'),
      '#default_value' => $this->configuration['client_id'],
      '#required' => TRUE,
    ];

    $form['secret_key'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Secret'),
      '#default_value' => $this->configuration['secret_key'],
      '#required' => TRUE,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    parent::submitConfigurationForm($form, $form_state);

    if (!$form_state->getErrors()) {
      $values = $form_state->getValue($form['#parents']);
      $this->configuration['client_id'] = $values['client_id'];
      $this->configuration['secret_key'] = $values['secret_key'];
    }

  }

  /**
   * {@inheritdoc}
   */
  public function createPaymentMethod(PaymentMethodInterface $payment_method, array $payment_details) {
    $required_keys = [
      'payerID', 'paymentID',
    ];
    foreach ($required_keys as $required_key) {
      if (empty($payment_details[$required_key])) {
        throw new \InvalidArgumentException(sprintf('$payment_details must contain the %s key.', $required_key));
      }
    }

    $paypalPayment = Payment::get($payment_details['paymentID'], $this->apiContext);

    if ($payer_info = $paypalPayment->getPayer()->getPayerInfo()) {
      $payment_method->paypal_mail = $payer_info->getEmail();
    }

    $payment_method->setRemoteId($payment_details['paymentID'] . '::' . $payment_details['payerID']);
    $payment_method->save();
  }

  public function deletePaymentMethod(PaymentMethodInterface $payment_method) {
    // TODO: Implement deletePaymentMethod() method.
  }

  /**
   * {@inheritdoc}
   */
  public function createPayment(PaymentInterface $payment, $capture = TRUE) {
    $mode = $payment->getPaymentGateway()->getPlugin()->getMode();

    if (!$capture) {
      // Only capture transaction type is currently supported.
      return;
    }

    list($paymentID, $payerID) = explode('::', $payment->getPaymentMethod()->getRemoteId());

    // Do not execute test suite payments because they don't have valid payerID.
    if (!$this->isTestSuitePayment($mode, $payerID)) {

      $paypalPayment = Payment::get($paymentID, $this->apiContext);
      $paymentExecution = (new PaymentExecution())->setPayerId($payerID);

      try {
        $paypalPayment->execute($paymentExecution, $this->apiContext);
      } catch (\Exception $exception) {
        \Drupal::logger('commerce_paypal_button')
          ->error($exception->getMessage());
        throw new InvalidResponseException('There was an error with Paypal request.');
      }

    }

    $next_state = $capture ? 'completed' : 'authorization';
    $payment->setState($next_state);
    $payment->setRemoteId($paymentID);
    $payment->setAuthorizedTime(REQUEST_TIME);
    if (!$capture) {
      $payment->setExpiresTime($this->time->getRequestTime() + (86400 * 29));
    }
    $payment->save();
  }

  protected function isTestSuitePayment($mode, $payerID) {
    return ($mode == 'test' && $payerID == 'TESTSUITE');
  }

  public function capturePayment(PaymentInterface $payment, Price $amount = NULL) {
    // TODO: Implement capturePayment() method.
  }

  public function voidPayment(PaymentInterface $payment) {
    // TODO: Implement voidPayment() method.
  }

  public function refundPayment(PaymentInterface $payment, Price $amount = NULL) {
    // TODO: Implement refundPayment() method.
  }

}
