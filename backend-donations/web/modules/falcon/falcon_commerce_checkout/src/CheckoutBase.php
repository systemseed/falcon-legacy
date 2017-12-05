<?php

namespace Drupal\falcon_commerce_checkout;

use Drupal\profile\Entity\Profile;
use Drupal\user\Entity\User;

use Drupal\commerce_order\Entity\Order;
use Drupal\commerce_order\Entity\OrderItem;
use Drupal\commerce_price\Price;
use Drupal\commerce_payment\Entity\PaymentGateway;
use Drupal\commerce_payment\Entity\PaymentMethod;
use Drupal\commerce_payment\Exception\DeclineException;
use Drupal\commerce_payment\Exception\PaymentGatewayException;
use Drupal\commerce_payment\Plugin\Commerce\PaymentGateway\OnsitePaymentGatewayInterface;
use Drupal\commerce_product\Entity\ProductVariation;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * CheckoutBase class.
 */
abstract class CheckoutBase implements CheckoutInterface {
  /**
   * An array of payment data given from front end.
   *
   *  Example: [
   *   'order_items' => [],   // List of products from basket, see products object in frontend.
   *   'profile' => [],       // Profile info with fields from Personal details form.
   *   'order_fields' => [],  // Order fields info from Checkout form.
   *   'payment' => [],       // Payment method info with payment details (token etc).
   * ]
   */
  protected $paymentData;

  /**
   * Type of profile entity used with given service type.
   */
  protected $profileType;

  /**
   * Type of order entity used with given service type.
   */
  protected $orderType;

  /**
   * Type of order item entity used with given service type.
   */
  protected $orderItemType;

  /**
   * Payment gateway id.
   */
  protected $paymentGatewayId;

  /**
   * An array of fields that will be added to created order.
   *
   *  Example: [
   *   'field_event_code' => '1',
   * ]
   */
  protected $orderFields;

  /**
   * An array of fields that will be added to created profile.
   *
   *  Example: [
   *   'field_profile_email' => 'falcon.customer-test@systemseed.com',
   *   'field_profile_first_name' => 'Name',
   * ]
   */
  protected $profileFields;

  /**
   * User account entity.
   */
  private $account;

  /**
   * Profile entity.
   */
  private $profile;

  /**
   * CheckoutBase constructor.
   */
  public function __construct($paymentData) {
    $this->orderFields = [];
    $this->profileFields = [];
    $this->paymentData = $paymentData;
    $this->paymentGatewayId = $paymentData['payment']['id'];
  }

  /**
   * {@inheritdoc}
   */
  public function processCheckout() {
    // @todo: add validation to not process payments if any required data is empty.
    $order = $this->createOrder();
    return $this->processPayment($order);
  }

  /**
   * Creates order from given data.
   */
  protected function createOrder() {
    $currency = $this->paymentData['payment']['currency'];

    // Creates order item objects.
    $store_ids = [];
    $order_items = [];
    foreach ($this->paymentData['order_items'] as $order_item) {
      $is_custom_price_product = $order_item['variantType'] == 'custom_price';

      $variation_id = $is_custom_price_product ? $order_item['price']['variation_id'] : $order_item['price'][$currency]['variation_id'];
      $variation = ProductVariation::load($variation_id);
      if (!$store_ids) {
        $product = $variation->getProduct();
        $store_ids = $product->getStoreIds();
      }

      // Create order item object.
      $order_item_object = OrderItem::create([
        'title' => $order_item['title'],
        'type' => $this->orderItemType,
        'purchased_entity' => $variation,
        'quantity' => $order_item['quantity'],
      ]);

      // TODO: make order item fields generic (same as order fields).
      if (!empty($order_item['field_gift_delivery_format'])) {
        $order_item_object->field_gift_delivery_format = $order_item['field_gift_delivery_format'];
      }

      // Set custom price for the Custom price products.
      $unit_price = $is_custom_price_product ? new Price($order_item['price']['amount'], $currency) : $variation->getPrice();
      $order_item_object->setUnitPrice($unit_price);

      // Saves order item.
      $order_item_object->save();
      $order_items[] = $order_item_object;
    }

    // Get user and profile objects.
    $account = $this->getUser();
    $profile = $this->getProfile();

    // Creates an order.
    $order = Order::create($this->orderFields + [
      'type' => $this->orderType,
      'state' => 'draft',
      'mail' => $account->getEmail(),
      'uid' => $account->id(),
      'ip_address' => '127.0.0.1', // @todo: Pass real IP from the ip bus.
      'billing_profile' => $profile,
      'store_id' => reset($store_ids), // @todo: we use one store now, improve to use multiple stores.
      'order_items' => $order_items,
      'placed' => REQUEST_TIME,
    ]);

    // @todo: add order validation to check if total price from front end equal total price from backend (if products price have changed).
    // Skip refresh because @todo
    $order->setRefreshState(Order::REFRESH_SKIP);
    $order->save();
    $order->setOrderNumber($order->id());
    return $order;
  }

  /**
   * Process payment for given order.
   */
  protected function processPayment($order) {

    // TODO: validate if this payment method is allowed for the user.
    $payment_details = $this->paymentData['payment'];

    // Init payment gateway.
    $payment_gateway = PaymentGateway::load($this->paymentGatewayId);
    /** @var \Drupal\commerce_payment\Plugin\Commerce\PaymentGateway\SupportsStoredPaymentMethodsInterface $payment_gateway_plugin */
    $payment_gateway_plugin = $payment_gateway->getPlugin();

    /** @var \Drupal\commerce_payment\Entity\PaymentMethodInterface $payment_method */
    $payment_method = PaymentMethod::create([
      'payment_gateway' => $this->paymentGatewayId,
      'type' => $this->paymentData['payment']['configuration']['payment_method_types'][0],
    ]);

    // Get user and profile objects.
    $account = $this->getUser();
    $profile = $this->getProfile();

    // Set user and profile info for payment method.
    $payment_method->setOwner($account);
    $payment_method->setBillingProfile($profile);

    // For security reasons the returned errors need to be more generic.
    try {
      $payment_gateway_plugin->createPaymentMethod($payment_method, $payment_details);
    }
    catch (DeclineException $e) {
      \Drupal::logger('commerce_payment')->warning($e->getMessage());
      throw new DeclineException('We encountered an error processing your payment method. Please verify your details and try again.');
    }
    catch (PaymentGatewayException $e) {
      \Drupal::logger('commerce_payment')->error($e->getMessage());
      throw new PaymentGatewayException('We encountered an unexpected error processing your payment method. Please try again later.');
    }

    $payment_storage = \Drupal::service('entity_type.manager')->getStorage('commerce_payment');
    $payment = $payment_storage->create([
      'state' => 'new',
      'amount' => $order->getTotalPrice(),
      'payment_gateway' => $payment_gateway->id(),
      'order_id' => $order->id(),
    ]);

    if ($payment_gateway_plugin instanceof OnsitePaymentGatewayInterface) {
      try {
        $payment->payment_method = $payment_method;

        // Finally process payment.
        $payment_gateway_plugin->createPayment($payment, TRUE);
        $order->payment_gateway = $payment->payment_gateway;
        $order->payment_method = $payment->payment_method;
        // Changes state of order.
        $order->getState()->value = 'completed';
        $order->save();

        // Returns data with order status.
        return new JsonResponse([
          'data' => [
            'order_id' => $order->id(),
            'order_uuid' => $order->uuid(),
            'order_status' => $order->getState()->value,
          ],
        ]);
      }
      catch (DeclineException $e) {
        throw new DeclineException('We encountered an error processing your payment method. Please verify your details and try again.');
      }
      catch (PaymentGatewayException $e) {
        \Drupal::logger('commerce_payment')->error($e->getMessage());
        throw new PaymentGatewayException('We encountered an unexpected error processing your payment method. Please try again later.');
      }
    }
  }

  /**
   * Create a new profile from given data.
   *
   * @return object
   *   Proifile entity.
   */
  private function getProfile() {
    if (empty($this->profile)) {
      $user = $this->getUser();

      $profile = Profile::create($this->profileFields + [
          'type' => $this->profileType,
          'uid' => $user->id(),
        ]);
      $profile->save();
      $this->profile = $profile;
    }

    return $this->profile;
  }

  /**
   * Load existing or create a new user from given email.
   *
   * @return object
   *   User object.
   */
  private function getUser() {
    if (empty($this->account)) {
      $email = $this->paymentData['profile']['email'];

      if ($account = user_load_by_mail($email)) {
        $this->account = $account;
      }
      else {
        $account = User::create([
          'name' => $email,
          'mail' => $email,
        ]);
        $account->save();
        $this->account = $account;
      }
    }
    return $this->account;
  }
}
