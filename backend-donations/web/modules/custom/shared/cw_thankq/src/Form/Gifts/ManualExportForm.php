<?php

namespace Drupal\cw_thankq\Form\Gifts;

use Drupal\commerce_order\Entity\Order;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\cw_thankq\OrderProcessor\GiftsOrderProcessor;

class ManualExportForm extends FormBase {

  /* @var GiftsOrderProcessor */
  protected $processor;

  protected function __construct() {
    $this->processor = new GiftsOrderProcessor();
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'cw_thankq_gifts_manual_export';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $orders = $this->processor->getUnprocessed();

    $count = count($orders);

    if (!$count) {
      drupal_set_message($this->t('There are no Gifts orders for synchronisation.'), 'warning');

      return $form;
    }

    $items = [];
    foreach ($orders as $order) {

      $total = number_format($order->getTotalPrice()->getNumber(), 2, '.', '');
      $items[] = \Drupal::service('date.formatter')->format($order->getCompletedTime()) . ' - ' . $order->getEmail() . ' - ' . $total . ' ' . $order->getTotalPrice()->getCurrencyCode();
    }

    $items = [];
    foreach ($orders as $order) {

      $items[] = self::orderFormatted($order);
    }
    $form['info'] = [
      '#title' => $this->t('Orders ready for export:'),
      '#theme' => 'item_list',
      '#items' => $items,
    ];

    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => \Drupal::translation()->formatPlural($count, 'Process one order', 'Process @count orders', ['@count' => $count]),
      '#suffix' => $this->t('using @instance database.', ['@instance' => $this->processor->getThankQName()]),
      '#attributes' => array(
        'class' => array('button', 'button--primary'),
      ),
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $orders = $this->processor->getUnprocessed();
    $orders_success = $orders_error = [];

    if (empty($orders)) {
      // No orders or all orders were already processed in previous cron run.
      return;
    }

    $operations = [
      [[$this, 'startBatch'], []]
    ];
    foreach ($orders as $order) {
      $operations[] = [
        [$this, 'processBatch'],
        [$order]
      ];
    }

    $batch = array(
      'title' => $this->t('Exporting orders into ThankQ CRM'),
      'operations' => $operations,
      'finished' => self::class . '::batchFinished',
    );

    batch_set($batch);
  }

  /**
   * Batch process callback to init results array.
   */
  public function startBatch(&$context) {
    $context['results']['success_messages'] = [];
    $context['results']['error_messages'] = [];
  }

  /**
   * Batch process callback.
   */
  public function processBatch(Order $order, &$context) {
    try {
      // Initialise new processor on each request to avoid
      $processor = new GiftsOrderProcessor();
      $processor->process($order);
      $context['results']['success_messages'][] = $order->get('field_thankq_id')->getString() . ' - ' . self::orderFormatted($order);
    }
    catch (\Exception $e) {
      $context['results']['error_messages'][] = $this->t('Error') . ': ' . self::orderFormatted($order) . ' - ' . $e->getMessage();
      watchdog_exception('cw_thankq', $e);
    }
  }

  /**
   * Batch finished callback.
   */
  public static function batchFinished($success, $results, $operations) {
    if (!empty($results['success_messages'])) {
      foreach ($results['success_messages'] as $message) {
        drupal_set_message($message);
      }
    }
    if (!empty($results['error_messages'])) {
      foreach ($results['error_messages'] as $message) {
        drupal_set_message($message, 'error');
      }
    }
  }

  /**
   * Build a summary string of the order.
   *
   * @param $order \Drupal\commerce_order\Entity\Order
   * @return string
   */
  public static function orderFormatted($order) {
    $total = number_format($order->getTotalPrice()->getNumber(), 2, '.', '');
    return \Drupal::service('date.formatter')->format($order->getCompletedTime()) . ' - ' . $order->getEmail() . ' - ' . $total . ' ' . $order->getTotalPrice()->getCurrencyCode();
  }
}
