<?php

namespace Drupal\falcon_thankq\Form\Gifts;

use Drupal\commerce_order\Entity\Order;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\falcon_thankq\OrderProcessor\GiftsOrderProcessor;

/**
 * Class IndividualManualExportForm
 *
 * @package Drupal\falcon_thankq\Form\Gifts
 *
 * Push one order to ThankQ. Appears on order ThankQ tab.
 */
class IndividualManualExportForm extends FormBase {

  /* @var GiftsOrderProcessor */
  protected $processor;

  protected function __construct() {
    $this->processor = new GiftsOrderProcessor();
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'falcon_thankq_gifts_individual_manual_export';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, Order $commerce_order = NULL) {

    if (empty($commerce_order)) {
      drupal_set_message($this->t('Order not found.'), 'warning');
      return $form;
    }
    if ($commerce_order->getState()->value !== 'completed') {
      drupal_set_message($this->t('Order is not completed.'), 'warning');
      return $form;
    }

    $form['notice'] = [
      '#markup' => '<br /><strong>' . $this->t('The order will be pushed to ThankQ with current date and time. Please use with caution!') . '</strong>',
    ];

    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Push order @order_id to ThankQ', ['@order_id' => $commerce_order->id()]),
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

    /* @var Order */
    $order = $form_state->getBuildInfo()['args'][0];

    if ($order) {
      try {
        $processor = new GiftsOrderProcessor();
        $processor->process($order);

        drupal_set_message($this->t('Order successfully pushed to ThankQ with weborder id @thankq_id', ['@thankq_id' => $order->get('field_thankq_id')->getString()]));
        $form_state->setRedirect('entity.commerce_order.canonical', ['commerce_order' => $order->id()]);
      }
      catch (\Exception $e) {
        drupal_set_message($this->t('Error') . ': ' . $e->getMessage(), 'error');
      }
    }
  }
}
