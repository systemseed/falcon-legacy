<?php

namespace Drupal\falcon_event_codes;

use Drupal\Core\Entity\Sql\SqlContentEntityStorage;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\falcon_event_codes\Entity\EventCodeInterface;

/**
 * Defines the storage handler class for Event code entities.
 *
 * This extends the base storage class, adding required special handling for
 * Event code entities.
 *
 * @ingroup falcon_event_codes
 */
class EventCodeStorage extends SqlContentEntityStorage implements EventCodeStorageInterface {

  /**
   * {@inheritdoc}
   */
  public function revisionIds(EventCodeInterface $entity) {
    return $this->database->query(
      'SELECT vid FROM {event_code_revision} WHERE id=:id ORDER BY vid',
      array(':id' => $entity->id())
    )->fetchCol();
  }

  /**
   * {@inheritdoc}
   */
  public function userRevisionIds(AccountInterface $account) {
    return $this->database->query(
      'SELECT vid FROM {event_code_field_revision} WHERE uid = :uid ORDER BY vid',
      array(':uid' => $account->id())
    )->fetchCol();
  }

  /**
   * {@inheritdoc}
   */
  public function countDefaultLanguageRevisions(EventCodeInterface $entity) {
    return $this->database->query('SELECT COUNT(*) FROM {event_code_field_revision} WHERE id = :id AND default_langcode = 1', array(':id' => $entity->id()))
      ->fetchField();
  }

  /**
   * {@inheritdoc}
   */
  public function clearRevisionsLanguage(LanguageInterface $language) {
    return $this->database->update('event_code_revision')
      ->fields(array('langcode' => LanguageInterface::LANGCODE_NOT_SPECIFIED))
      ->condition('langcode', $language->getId())
      ->execute();
  }

}
