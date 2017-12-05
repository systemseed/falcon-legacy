<?php

namespace Drupal\commerce_paypal_button;

use Drupal\Core\Logger\RfcLoggerTrait;
use Drupal\Core\Logger\RfcLogLevel;
use Psr\Log\LoggerInterface;

/**
 * Wrapper around current Drupal logger to skip DEBUG log messages from PayPal.
 */
class PaypalLogger implements LoggerInterface {
  use RfcLoggerTrait;

  /* @var \Psr\Log\LoggerInterface */
  protected $logger;

  /**
   * PaypalLogger constructor.
   */
  public function __construct() {
    $this->logger = \Drupal::logger('paypal_php_sdk');

  }

  /**
   * {@inheritdoc}
   */
  public function log($level, $message, array $context = array()) {
    if ($level < RfcLogLevel::DEBUG) {
      $this->logger->log($level, $message, $context);
    }
  }

}
