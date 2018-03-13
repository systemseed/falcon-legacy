<?php

namespace Drupal\cw_gifts_cards;

use Drupal\Component\Render\FormattableMarkup;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\cw_gifts_cards\Entity\EcardItem;
use Drupal\falcon_gifts_api\InternalClient;
use Drupal\mailsystem\MailsystemManager;
use Drupal\Core\Render\Renderer;
use Drupal\Core\Language\LanguageManager;
use Drupal\Core\Config\ConfigFactory;
use Psr\Log\LoggerInterface;

/**
 * Class MailSender.
 *
 * @package Drupal\cw_gifts_cards
 */
class MailSender implements MailSenderInterface {

  /**
   * The entity query factory service.
   *
   * @var \Drupal\Core\Entity\Query\QueryFactory
   */
  protected $entityQuery;

  /**
   * E-Card Item entity storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $ecardItemStorage;

  /**
   * Page config entity storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $pageConfigStorage;

  /**
   * Drupal\mailsystem\MailsystemManager definition.
   *
   * @var \Drupal\mailsystem\MailsystemManager
   */
  protected $pluginManagerMail;

  /**
   * Drupal\Core\Render\Renderer definition.
   *
   * @var \Drupal\Core\Render\Renderer
   */
  protected $renderer;

  /**
   * Drupal\Core\Language\LanguageManager definition.
   *
   * @var \Drupal\Core\Language\LanguageManager
   */
  protected $languageManager;

  /**
   * Drupal\Core\Config\ConfigFactory definition.
   *
   * @var \Drupal\Core\Config\ConfigFactory
   */
  protected $configFactory;

  /**
   * A logger instance.
   *
   * @var \Psr\Log\LoggerInterface
   */
  protected $logger;

  /**
   * MailSender constructor.
   *
   * @param \Drupal\Core\Entity\Query\QueryFactory $entity_query
   *   The entity query factory service.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\mailsystem\MailsystemManager $plugin_manager_mail
   *   MailsystemManager service.
   * @param \Drupal\Core\Render\Renderer $renderer
   *   Renderer service.
   * @param \Drupal\Core\Language\LanguageManager $language_manager
   *   Landuage service.
   * @param \Drupal\Core\Config\ConfigFactory $config_factory
   *   Config factory service.
   * @param \Psr\Log\LoggerInterface $logger
   *   Module's logger.
   */
  public function __construct(QueryFactory $entity_query, EntityTypeManagerInterface $entity_type_manager, MailsystemManager $plugin_manager_mail, Renderer $renderer, LanguageManager $language_manager, ConfigFactory $config_factory, LoggerInterface $logger) {
    $this->entityQuery = $entity_query;
    $this->ecardItemStorage = $entity_type_manager->getStorage('ecard_item');
    $this->pageConfigStorage = $entity_type_manager->getStorage('config_pages');
    $this->pluginManagerMail = $plugin_manager_mail;
    $this->renderer = $renderer;
    $this->languageManager = $language_manager;
    $this->configFactory = $config_factory;
    $this->logger = $logger;
  }

  /**
   * Load email template from database and prepare for sending.
   *
   * @param $tokens
   * @return string
   */
  public function getTemplate($tokens) {

    $entities = $this->pageConfigStorage->loadByProperties(['type' => 'email_templates']);
    if (is_array($entities)) {
      $emailsConfigEntity = array_pop($entities);
      $template = $emailsConfigEntity->get('field_ecard_to_friend_body')->value;

      return (string) new FormattableMarkup($template, $tokens);
    }

    // TODO: load default field value if it's not overwritten in db.
    return '';
  }

  /**
   * Send E-card items scheduled for today.
   */
  public function sendScheduled() {

    // TODO: make sending time configurable.
    // Send all today's cards in the morning.
    if (REQUEST_TIME <= strtotime('08:00:00 AM')) {
      return;
    }

    $ids = $this->entityQuery->get('ecard_item')
      ->condition('type', 'gift')
      ->condition('sending_status', 0)
      ->condition('sending_timestamp', REQUEST_TIME, '<=')
      ->execute();

    if (empty($ids)) {
      return;
    }

    foreach ($this->ecardItemStorage->loadMultiple($ids) as $ecardItem) {
      $this->send($ecardItem);
    }
  }

  /**
   * Send email with gift link to a friend.
   *
   * @param \Drupal\cw_gifts_cards\Entity\EcardItem $ecardItem
   *   Card item to be sent.
   *
   * @return bool
   *   TRUE if success.
   */
  public function send(EcardItem $ecardItem) {

    // Only normal gifts are supported.
    if ($ecardItem->bundle() != 'gift') {
      return FALSE;
    }

    $to = $ecardItem->get('field_friends_email')->value;
    $donations_order_uuid = $ecardItem->get('donations_order_uuid')->value;

    if (empty($to)) {
      return FALSE;
    }

    if (!$this->isOrderComplete($donations_order_uuid)) {
      return FALSE;
    }

    $params = [
      'headers' => [
        'Content-Type' => 'text/html',
      ],
      'from' => $this->configFactory->get('system.site')->get('mail'),
      'subject' => t('A friend has bought you a Gift'),
      'ecard_item' => $ecardItem,
    ];

    // Prepare tokens for email template.
    $tokens = [
      '@sender_name' => trim($ecardItem->get('field_sender_first_name')->value . ' ' . $ecardItem->get('field_sender_last_name')->value),
      '@friend_name' => $ecardItem->get('field_friends_name')->value,
      '@button_url' => $this->getExternalItemUrl($ecardItem),
    ];

    // Prepare email body.
    $params['body'] = $this->getTemplate($tokens);

    $langcode = \Drupal::languageManager()->getDefaultLanguage()->getId();

    $message = \Drupal::service('plugin.manager.mail')->mail('cw_gifts_cards', 'ecard_item', $to, $langcode, $params);
    if ($message['result']) {
      $ecardItem->set('sending_status', TRUE);
      $ecardItem->set('sent_timestamp', REQUEST_TIME);
      $ecardItem->save();

      $this->logger->info('Gift E-Card @id has been sent to @mail.', ['@id' => $ecardItem->id(), '@mail' => $to]);

      return TRUE;
    }

    return FALSE;
  }

  /**
   * Check remote order status is complete.
   *
   * @param string $order_uuid
   *   Order UUID in Donations service.
   *
   * @return bool
   *   TRUE if order is valid and in complete state.
   */
  public function isOrderComplete($order_uuid) {
    $client = new InternalClient('backend-donations', 'gifts_manager');
    $response = $client->get("/v1/donations/jsonapi/commerce_order/gift/$order_uuid");

    if ($response['data']['attributes']['state'] === 'completed') {
      return TRUE;
    }

    return FALSE;
  }

  /**
   * Build full frontend URL to the gift card.
   *
   * @param \Drupal\cw_gifts_cards\Entity\EcardItem $ecardItem
   * @return string
   */
  public function getExternalItemUrl(EcardItem $ecardItem) {
    $frontend_base_url = rtrim($this->configFactory->get('routes')->get('frontend-gifts')['url'], '/');

    return $frontend_base_url . '/gift-card/' . $ecardItem->uuid();
  }

}
