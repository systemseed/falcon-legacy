<?php

namespace Drupal\cw_gifts_cards;

use Drupal\Core\Entity\Sql\SqlContentEntityStorage;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\cw_gifts_cards\Entity\GiftCardConfigEntityInterface;

/**
 * Defines the storage handler class for Gifts Card Configuration entities.
 *
 * This extends the base storage class, adding required special handling for
 * Gifts Card Configuration entities.
 *
 * @ingroup cw_gifts_cards
 */
class GiftCardConfigEntityStorage extends SqlContentEntityStorage implements GiftCardConfigEntityStorageInterface {

  /**
   * {@inheritdoc}
   */
  public function revisionIds(GiftCardConfigEntityInterface $entity) {
    return $this->database->query(
      'SELECT vid FROM {gift_card_config_revision} WHERE id=:id ORDER BY vid',
      array(':id' => $entity->id())
    )->fetchCol();
  }

  /**
   * {@inheritdoc}
   */
  public function userRevisionIds(AccountInterface $account) {
    return $this->database->query(
      'SELECT vid FROM {gift_card_config_field_revision} WHERE uid = :uid ORDER BY vid',
      array(':uid' => $account->id())
    )->fetchCol();
  }

  /**
   * {@inheritdoc}
   */
  public function countDefaultLanguageRevisions(GiftCardConfigEntityInterface $entity) {
    return $this->database->query('SELECT COUNT(*) FROM {gift_card_config_field_revision} WHERE id = :id AND default_langcode = 1', array(':id' => $entity->id()))
      ->fetchField();
  }

  /**
   * {@inheritdoc}
   */
  public function clearRevisionsLanguage(LanguageInterface $language) {
    return $this->database->update('gift_card_config_revision')
      ->fields(array('langcode' => LanguageInterface::LANGCODE_NOT_SPECIFIED))
      ->condition('langcode', $language->getId())
      ->execute();
  }

}
