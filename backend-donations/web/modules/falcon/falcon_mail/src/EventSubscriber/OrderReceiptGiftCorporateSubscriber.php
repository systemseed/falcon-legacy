<?php

namespace Drupal\falcon_mail\EventSubscriber;

use Drupal\commerce_order\OrderTotalSummaryInterface;
use Drupal\commerce_product\Entity\ProductVariationInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Mail\MailManagerInterface;
use Drupal\Core\Render\RenderContext;
use Drupal\Core\Render\Renderer;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\state_machine\Event\WorkflowTransitionEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Sends a corporate gift notification email when an order is placed.
 */
class OrderReceiptGiftCorporateSubscriber implements EventSubscriberInterface {

  use StringTranslationTrait;

  /**
   * The order type entity storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $orderTypeStorage;

  /**
   * The order total summary.
   *
   * @var \Drupal\commerce_order\OrderTotalSummaryInterface
   */
  protected $orderTotalSummary;

  /**
   * The entity view builder for profiles.
   *
   * @var \Drupal\profile\ProfileViewBuilder
   */
  protected $profileViewBuilder;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * The mail manager.
   *
   * @var \Drupal\Core\Mail\MailManagerInterface
   */
  protected $mailManager;

  /**
   * The renderer.
   *
   * @var \Drupal\Core\Render\RendererInterface
   */
  protected $renderer;

  /**
   * The config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * Constructs a new OrderReceiptGiftCorporateSubscriber object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager.
   * @param \Drupal\Core\Mail\MailManagerInterface $mail_manager
   *   The mail manager.
   * @param \Drupal\commerce_order\OrderTotalSummaryInterface $order_total_summary
   *   The order total summary.
   * @param \Drupal\Core\Render\Renderer $renderer
   *   The renderer.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, LanguageManagerInterface $language_manager, MailManagerInterface $mail_manager, OrderTotalSummaryInterface $order_total_summary, Renderer $renderer, ConfigFactoryInterface $config_factory) {
    $this->orderTypeStorage = $entity_type_manager->getStorage('commerce_order_type');
    $this->orderTotalSummary = $order_total_summary;
    $this->profileViewBuilder = $entity_type_manager->getViewBuilder('profile');
    $this->languageManager = $language_manager;
    $this->mailManager = $mail_manager;
    $this->renderer = $renderer;
    $this->configFactory = $config_factory;
  }

  /**
   * Sends corporate gift notification email.
   *
   * @param \Drupal\state_machine\Event\WorkflowTransitionEvent $event
   *   The event we subscribed to.
   */
  public function sendOrderReceiptGiftCorporate(WorkflowTransitionEvent $event) {
    // Send notification only if there are configured email addresses.
    $to = $this->configFactory->get('falcon_mail.settings')->get('notifications.list_gift_corporate');
    if (!$to) {
      return;
    }

    /** @var \Drupal\commerce_order\Entity\OrderInterface $order */
    $order = $event->getEntity();

    // Send notification only for corporate gift orders.
    foreach ($order->getItems() as $order_item) {
      $purchased_entity = $order_item->getPurchasedEntity();
      if (!$purchased_entity instanceof ProductVariationInterface) {
        return;
      }
      $product = $purchased_entity->getProduct();
      if ($product->bundle() != 'gift_corporate') {
        return;
      }
    }

    $params = [
      'headers' => [
        'Content-Type' => 'text/html; charset=UTF-8;',
        'Content-Transfer-Encoding' => '8Bit',
      ],
      'from' => $order->getStore()->getEmail(),
      'subject' => $this->t('Corporate Gift Order #@number', ['@number' => $order->getOrderNumber()]),
      'order' => $order,
    ];

    $build = [
      '#theme' => 'falcon_mail_commerce_order_receipt_gift_corporate',
      '#order_entity' => $order,
      '#order_url' => $order->toUrl('canonical', ['absolute' => TRUE])->toString(),
      '#totals' => $this->orderTotalSummary->buildTotals($order),
    ];
    if ($billing_profile = $order->getBillingProfile()) {
      $build['#billing_information'] = $this->profileViewBuilder->view($billing_profile);
    }
    $params['body'] = $this->renderer->executeInRenderContext(new RenderContext(), function () use ($build) {
      return $this->renderer->render($build);
    });

    $langcode = $this->languageManager->getDefaultLanguage()->getId();

    $this->mailManager->mail('falcon_mail', 'commerce_order_receipt_gift_corporate', $to, $langcode, $params);
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events = ['commerce_order.place.post_transition' => ['sendOrderReceiptGiftCorporate', -100]];
    return $events;
  }

}
