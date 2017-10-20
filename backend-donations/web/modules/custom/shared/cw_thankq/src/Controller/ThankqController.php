<?php

namespace Drupal\cw_thankq\Controller;

use Drupal\commerce_order\Entity\Order;
use Drupal\Component\Render\FormattableMarkup;
use Drupal\Component\Utility\Html;
use Drupal\Core\Controller\ControllerBase;
use Drupal\cw_thankq\ThankqClient;

class ThankqController extends ControllerBase {

  /**
   * Prints list of ThankQ products.
   */
  public function getProductsList() {
    $result = (new ThankqClient())->doTradingLookup();

    if (empty($result['products'])) {
      return [
        '#type' => 'markup',
        '#markup' => 'ThankQ returned empty product list.',
      ];
    }

    $header = [
      // We make it sortable by name.
      ['data' => $this->t('ThankQ ID'), 'field'],
      ['data' => $this->t('Type')],
      ['data' => $this->t('Name')],
      ['data' => $this->t('Price')],
      ['data' => $this->t('Web product')],
    ];

    // Populate the rows.
    $rows = [];
    foreach($result['products'] as $product) {
      $thankq_id = !empty($product->coreProduct->productID) ? $product->coreProduct->productID : '';
      $product_url = '';

      // Find existing product in Drupal by ThankQ ID.
      $query = \Drupal::entityTypeManager()->getStorage('commerce_product')->getQuery();

      if ($thankq_id) {
        $product_ids = $query
          ->condition('variations.entity.field_thankq_id', $product->coreProduct->productID)
          ->execute();

        if ($product_ids) {
          $url = \Drupal\Core\Url::fromRoute('entity.commerce_product.edit_form', ['commerce_product' => reset($product_ids)], ['absolute' => TRUE]);
          $product_url = $url->toString();
        }
      }

      $rows[] = [
        'thankq_id' => $thankq_id,
        'type' => empty($product->coreProduct->productType) ? '' : $product->coreProduct->productType,
        'name' => empty($product->coreProduct->name) ? '' : $product->coreProduct->name,
        'price' => $product->price,
        'product_link' => empty($product_url) ? '' : new FormattableMarkup('<a href="@url">Edit gift</a>', ['@url' => $product_url]),
      ];
    }

    // Generate the table.
    $build['table'] = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $rows,
    );

    return $build;

  }

  /**
   * Prints ThankQ order info.
   *
   * @param \Drupal\commerce_order\Entity\Order $commerce_order
   * @return array
   */
  public function getOrder(Order $commerce_order) {
    if ($commerce_order->get('field_thankq_id')->isEmpty()) {
      return [
        '#type' => 'markup',
        '#markup' => 'This order was not exported into ThankQ.',
      ];
    }

    $client = new ThankqClient();
    $order = $client->doTradingOrderGet($commerce_order->get('field_thankq_id')->getString());

    if (empty($order)) {
      return [
        '#type' => 'markup',
        '#markup' => 'Order not found in ThankQ.',
      ];
    }

    $rows = [];

    foreach ($order as $key => $value) {
      if ($key === 'products') {
        $product_header = [];
        $product_rows = [];

        foreach ($value->esitWStradingOrderProduct as $productObj) {
          $product = (array) $productObj;
          $product_header = array_keys($product);
          $product_row = [];
          foreach ($product as $col => $value) {
            $product_header[] = $col;
            $product_row[] = ['data' => $value, 'class' => Html::getClass($col)];

          }

          $product_rows[] = $product_row;
        }

        $rows[] = [
          'key' => strtoupper($key),
          'value' => ['data' => [
            '#theme' => 'table',
            '#header' => $product_header,
            '#rows' => $product_rows,
          ]],
        ];
      }
      else {
        $rows[] = [
          'key' => strtoupper($key),
          'value' => ['data' => (string) $value, 'class' => Html::getClass($key)],
        ];
      }

    }

    // Fetch user data from ThankQ.
    $contact = $client->doContactGet($order['serialnumber']);
    if ($contact) {

      $rows[] = [
        ['data' => ['#markup' => '<h2>CONTACT DATA</h2>'], 'colspan' => 2]
      ];

      // Flatten contact data.
      $contactData = [];
      foreach ($contact as $category => $value) {
        $contactData += (array) $value;
      }

      foreach ($contactData as $key => $value) {
        $rows[] = [
          'key' => strtoupper($key),
          'value' => ['data' => (string) $value, 'class' => Html::getClass($key)],
        ];
      }
    }

    if ($commerce_order->hasField('field_order_gift_aid')) {
      // Fetch Gift Aid data from ThankQ.
      $gad_info = $client->doGADsGet($order['serialnumber']);
      if (!empty($gad_info['GADs']->esitWSGAD)) {

        $rows[] = [
          ['data' => ['#markup' => '<h2>GIFT AID</h2>'], 'colspan' => 2]
        ];

        // Outputs all Gift aids records.
        foreach ($gad_info['GADs']->esitWSGAD as $gad_item) {
          foreach ($gad_item as $key => $value) {
            $rows[] = [
              'key' => strtoupper($key),
              'value' => ['data' => (string) $value, 'class' => Html::getClass($key)],
            ];
          }
        }
      }
    }

    // Generate the table.
    $build['table'] = array(
      '#theme' => 'table',
      '#header' => [],
      '#rows' => $rows,
    );

    return $build;
  }
}
