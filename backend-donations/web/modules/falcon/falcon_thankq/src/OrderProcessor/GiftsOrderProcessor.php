<?php

namespace Drupal\falcon_thankq\OrderProcessor;

use Drupal\address\Plugin\Field\FieldType\AddressItem;
use Drupal\commerce_order\Entity\Order;
use Drupal\commerce_price\Price;
use Drupal\falcon_thankq\ThankqClient;
use Drupal\profile\Entity\ProfileInterface;
use Drupal\Core\Url;

/**
 * Class GiftsOrderProcessor.
 *
 * This class encapsulates ThankQ logic for Gifts orders.
 * This can be refactored into interface when we have more cases of integration
 * with ThankQ.
 */
class GiftsOrderProcessor {

  /* @var \Drupal\falcon_thankq\ThankqClient */
  protected $client;

  /**
   * GiftsOrderProcessor constructor.
   */
  public function __construct() {
    // Init SOAP client.
    $this->client = new ThankqClient();
  }

  /**
   * Returns a short summary about ThankQ export status.
   *
   * @param $date_string
   * @return \Drupal\Core\StringTranslation\TranslatableMarkup|string
   */
  public static function getDailySummary($date_string) {
    // Prepare three groups of orders.
    $count_total = 0;
    $count_success = 0;
    $count_error = 0;
    // NOTE: Corporate orders are not processed at the moment.
    $count_corporate = 0;

    // Prepare timestamps for start and end of that date.
    $start_time = strtotime($date_string);
    $end_time = $start_time + (24 * 60 * 60) - 1;

    $storage = \Drupal::entityTypeManager()->getStorage('commerce_order');
    $query = $storage->getQuery();

    // Query all orders for that date.
    $order_ids = $query
      ->condition('type', 'gift')
      ->condition('state', 'completed')
      ->condition('completed', [$start_time, $end_time], 'BETWEEN')
      ->execute();

    $count_total = count($order_ids);

    // TODO: add caching for past dates.
    /* @var Order $order */
    foreach ($storage->loadMultiple($order_ids) as $order) {
      // ThankQ ID is not empty and starts with W then it is a successful order.
      if (strpos($order->get('field_thankq_id')->getString(), 'W') === 0) {
        $count_success++;
        continue;
      }

      // Get type of the first product to determine if the order is normal or
      // corporate.
      $product_type = $order->getItems()[0]->getPurchasedEntity()->get('product_id')->entity->bundle();
      if ($product_type == 'gift_corporate') {
        $count_corporate++;
        continue;
      }

      // This order was not processed (yet).
      $count_error++;
    }

    $text = [];
    if (!$count_total) {
      return t('No orders');
    }
    $text[] = t('@count orders total', ['@count' => $count_total]);

    if ($count_success) {
      $text[] = t('@count order(s) successfully exported', ['@count' => $count_success]);
    }

    if ($count_error) {
      if (REQUEST_TIME > $end_time) {
        $text[] = '<strong>' . t('@count order(s) with errors', ['@count' => $count_error]) . '</strong>';
      }
      else {
        $text[] = t('@count pending export', ['@count' => $count_error]);
      }
    }

    if ($count_corporate) {
      $text[] = t('@count corporate order(s)', ['@count' => $count_corporate]);
    }


    return implode(', ', $text);

  }

  /**
   * Get orders ready for export to ThankQ.
   *
   * @return Order[]
   *   Array of commerce orders.
   */
  public function getUnprocessed() {

    // Get unprocessed orders for today.
    $storage = \Drupal::entityTypeManager()->getStorage('commerce_order');
    $query = $storage->getQuery();
    $query
      ->condition('type', 'gift')
      ->condition('state', 'completed')
      // The order is unprocessed if ThankQ ID is empty.
      ->notExists('field_thankq_id.value')
      ->condition('total_price__number', '0', '>')
      // Process only today's orders. If an older order was not processed due to
      // an error then it has to be processed manually by staff.
      ->condition('completed', strtotime('00:00:00'), '>=')
      // Filter orders by purchased product variants.
      ->condition('order_items.entity.purchased_entity', $this->getValidVariantIds(), 'IN');

    $order_ids = $query->execute();

    return $storage->loadMultiple($order_ids);
  }

  /**
   * Helper to fetch IDs of common (non-corporate) Gifts.
   *
   * @return array
   *   Variant ids.
   */
  public function getValidVariantIds() {
    return \Drupal::entityTypeManager()->getStorage('commerce_product_variation')
      ->getQuery()
      ->condition('type', 'gift')
      ->condition('product_id.entity.type', 'gift')
      ->execute();
  }

  /**
   * Utility function to prepare correct campaign id for the order.
   * See:
   * - https://www.pivotaltracker.com/story/show/144928107/comments/179101414
   * - https://www.pivotaltracker.com/story/show/150012885/comments/179991821
   *
   * @param string $payment_gateway_name
   *
   * @return string
   *   Campaign Id.
   */
  protected function formatCampaignId($payment_gateway_name) {
    if (strpos($payment_gateway_name, 'paypal')) {
      return 'TELPP02';
    }
    else {
      return 'TELCC02';
    }
  }

  public function formatPaymentType($payment_gateway_name) {
    if (strpos($payment_gateway_name, 'paypal')) {
      return 'PayPal';
    }
    else {
      return 'Credit Card';
    }
  }

  public function process(Order $order) {

    // Prepare some data to reuse in API call params.
    $address = FALSE;
    if (!$order->getBillingProfile()->get('field_profile_address')->isEmpty()) {
      /* @var AddressItem $address */
      $address = $order->getBillingProfile()->get('field_profile_address')[0];
    }

    // Break payment into per-product parts as per CW requiremrnt.
    $donation_pieces = [];

    $source_code = $order->get('field_event_code')->isEmpty() ? '' : $order->get('field_event_code')->entity->get('code')->getString();

    $payment_gateway_name = $order->get('payment_gateway')->getString();

    $full_country_list = \Drupal::service('address.country_repository')->getList();

    // ThankQ contact.
    $firstname = $order->getBillingProfile()->get('field_profile_first_name')->getString();
    $keyname = $order->getBillingProfile()->get('field_profile_last_name')->getString();

    // Get contact title if it is available on this backend.
    $contact_title = $order->getBillingProfile()->hasField('field_profile_title') ? $order->getBillingProfile()->get('field_profile_title')->getString() : '';

    $thankq_contact = [
      'title' => $contact_title,
      'firstname' => $firstname,
      'keyname' => $keyname,
      'emailAddress' => $order->getEmail(),
      'addressLine1' => $this->formatAddressLine1($address),
      'addressLine3' => $address && $address->getLocality() ? $address->getLocality() : '',
      'addressLine4' => $address && $address->getAdministrativeArea() ? $address->getAdministrativeArea() : '',
      'country' => $address && $address->getCountryCode() ? $full_country_list[$address->getCountryCode()] : '',
      'mobileNumber' => $order->getBillingProfile()->get('field_profile_phone')->getString(),
      'doNotMail' => $this->formatOptInValue($order->getBillingProfile()->get('field_profile_prefs_post')->value),
      'doNotPhone' => $this->formatOptInValue($order->getBillingProfile()->get('field_profile_prefs_phone')->value),
      'doNotEmail' => $this->formatOptInValue($order->getBillingProfile()->get('field_profile_prefs_email')->value),
      'doNotSMS' => $this->formatOptInValue($order->getBillingProfile()->get('field_profile_prefs_sms')->value),
    ];

    // ThankQ order.
    $thankq_order = [
      'sourceCode' => $source_code,
      'specialInstructions' => $order->id(),
      'paymentType' => $this->formatPaymentType($payment_gateway_name),
      'totalPayment' => $this->formatPrice($order->getTotalPrice()->getNumber()),
      'teleHeader' => $this->formatCampaignId($payment_gateway_name),
    ];

    /* @var \Drupal\commerce_order\Entity\OrderItem $item */
    foreach ($order->getItems() as $item) {

      /* @var \Drupal\commerce_product\Entity\Product $product */
      $product = $item->getPurchasedEntity()->get('product_id')->entity;

      if ($item->getPurchasedEntity()->get('field_thankq_id')->isEmpty()) {
        throw new \Exception(t('Product @product has no ThankQ ID. Order cannot be processed.', ['@product' => $product->label()]));
      }

      // Can be either Email or Post. Default to Post.
      $deliveryFormat = $item->get('field_gift_delivery_format')->isEmpty() ? 'Post' : $item->get('field_gift_delivery_format')->getString();


      $gift_code = $product->get('field_gift_product_code')->getString();

      $thankq_order['products'][] = [
        'productID' => $item->getPurchasedEntity()->get('field_thankq_id')->getString(),
        'productsOrdered' => intval($item->getQuantity()),
        'sellingPrice' => $this->formatPrice($item->getUnitPrice()->getNumber()),
        'lineTotal' => $this->formatPrice($item->getTotalPrice()->getNumber()),
        'sourceCode' => $source_code,
        'prefulfilled' => FALSE,
        'giftCode' => $gift_code,
        'deliveryFormat' => $deliveryFormat,
      ];

      // Prepare donation amounts per product.
      if (empty($donation_pieces[$gift_code])) {
        $donation_pieces[$gift_code] = 0;
      }
      $donation_pieces[$gift_code] += floatval($item->getTotalPrice()->getNumber());
    }

    // Adds Gift Aid field's value for UK or FALSE for ROI.
    $giftaid_value = $order->hasField('field_order_gift_aid') ? (bool) $order->get('field_order_gift_aid')->value : FALSE;

    $serial_number = $this->client->doContactInsert($thankq_contact);

    $thankq_order['serialnumber'] = $serial_number;
    $thankq_order_id = $this->client->doTradingOrderSet($thankq_order);

    // ThankQ donation (one row per product type).
    foreach ($donation_pieces as $gift_code => $amount) {
      $thankq_donation = [
        'serialnumber' => $serial_number,
        'sourceCode' => $source_code,
        'destinationCode' => 'Gift',
        'amount' => $this->formatPrice($amount),
        'paymentType' => $this->formatPaymentType($payment_gateway_name),
        'campaignID' => $this->formatCampaignId($payment_gateway_name),
        'softCredit' => FALSE,
        'GAD' => $giftaid_value,
        'narrative' => $order->id(),
        'notes' => $gift_code,
        'receiptRequired' => 'Yes',
      ];

      $thankq_donation_id = $this->client->doDonateMemberInsert($thankq_donation);

      // Try to replace this log with doDonationsGet API call on
      // admin/commerce/orders/%order_id%/thankq page.
      \Drupal::logger('falcon_thankq')
        ->notice('Created donation @thankq_id in ThankQ with amount @amount for order @order_id.', [
          '@thankq_id' => $thankq_donation_id,
          '@amount' => $this->formatPrice($amount),
          '@order_id' => $order->id(),
        ]);

    }

    // Inserts data about Gift Aid only if it's UK and TRUE.
    if ($giftaid_value) {
      $thankq_gad = [
        'title' => $contact_title,
        'firstname' => $firstname,
        'keyname' => $keyname,
        'serialnumber' => $serial_number,
        'source' => $source_code,
      ];
      $this->client->doGADInsert($thankq_gad);
    }

    // Throw the exception if order wasn't saved correctly in ThankQ.
    $saved_order = $this->client->doTradingOrderGet($thankq_order_id);
    if (empty($saved_order)) {
      $exception_message = t("ThankQ Order ID has not been properly exported. Try to push it again. No data found in ThankQ for created order id. ThankQ ID: @thankq_order_id, Serial number: @serial_number.",
        ['@thankq_order_id' => $thankq_order_id, '@serial_number' => $serial_number]);
      throw new \Exception($exception_message);
    }

    $order->set('field_thankq_id', $thankq_order_id);
    $order->save();

  }

  /**
   * Format AddressLine1 for ThanKQ.
   *
   * @param \Drupal\address\Plugin\Field\FieldType\AddressItem $addressItem
   *
   * @return string
   *   AddressLine1 for ThankQ.
   */
  public function formatAddressLine1(AddressItem $addressItem) {
    if (!$addressItem) {
      return '';
    }

    $parts[] = $addressItem->getAddressLine1();
    $parts[] = $addressItem->getAddressLine2();

    return implode("\r\n", $parts);
  }

  /**
   * This function can be moved to parent class and enhanced to fetch
   * opt-in defaults for appeal.
   *
   * @param $value
   * @return bool
   */
  public function formatOptInValue($value) {

    return !$value;
  }

  /**
   * Simple ThankQ formatter for money.
   *
   * @param $amount
   * @return string
   */
  public function formatPrice($amount) {
    return number_format(floatval($amount), 2, '.', '');
  }

  public function getThankQName() {
    return $this->client->getInstance();
  }

  /**
   * Send an email about errors in ThankQ export process.
   *
   * @param $errors_data
   *   An array with following keys:
   *    - orders - An array of order objects.
   *    - error_message - String contains error message.
   */
  public function sendExportErrorEmail($errors_data) {
    $to = \Drupal::config('falcon_thankq.config')->get('error_recipients');
    if (empty($to)) {
      return;
    }

    // Prepares Email's subject and body.
    $subject = t('Concern Gifts: ThankQ export process finished with errors');
    $body = t('ThankQ export process finished with following errors') . ':<br />';

    // Attaches info with errors.
    foreach ($errors_data as $order_id => $data) {
      $body .= self::orderFormattedShort($data['order']) . ' - ' . $data['error_message'] . '<br />';
    }
    $thankq_report_url = Url::fromUri('internal:/admin/exports/gifts', ['absolute' => TRUE])->toString();
    $body .= '<br />' . t("See more details in <a href='@url'>ThankQ export report</a>.", ['@url' => $thankq_report_url]);

    $this->sendEmail('thankq_export_error', $to, $subject, $body);
  }

  /**
   * Send an email by given params.
   */
  public function sendEmail($key, $to, $subject, $body) {
    // Prepares Email's subject and body.
    $params = ['subject' => $subject, 'body' => $body];
    $langcode = \Drupal::languageManager()->getDefaultLanguage();

    // Send email with drupal_mail.
    $message =  \Drupal::service('plugin.manager.mail')->mail('falcon_thankq', $key, $to, $langcode, $params);

    // Add message to the log if email has been sent.
    $result_message = !empty($message['result']) ? t('%key notification has been successfully sent. Details: %body') : t('There was a problem sending %key notification message. Details: %body');
    \Drupal::logger('falcon_thankq')->notice($result_message, ['%key' => $key, '%body' => $body]);
  }

  /**
   * Build a summary string of the order in short format without email.
   *
   * @param $order \Drupal\commerce_order\Entity\Order
   * @return string
   */
  public static function orderFormattedShort($order) {
    $order_id = $order->id();

    // Prepares link to the order.
    $order_url = Url::fromUri('internal:/admin/commerce/orders/' . $order_id, ['absolute' => TRUE]);
    $order_link = \Drupal::l(t('Order') . ' ' . $order_id, $order_url);

    $total = number_format($order->getTotalPrice()->getNumber(), 2, '.', '');
    return \Drupal::service('date.formatter')->format($order->getCompletedTime()) . ' - ' . $order_link . ' - ' . $total . ' ' . $order->getTotalPrice()->getCurrencyCode();
  }
}
