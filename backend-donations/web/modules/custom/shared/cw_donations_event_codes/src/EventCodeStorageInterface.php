<?php

namespace Drupal\cw_donations_event_codes;

use Drupal\Core\Entity\ContentEntityStorageInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\cw_donations_event_codes\Entity\EventCodeInterface;

/**
 * Defines the storage handler class for Event code entities.
 *
 * This extends the base storage class, adding required special handling for
 * Event code entities.
 *
 * @ingroup cw_donations_event_codes
 */
interface EventCodeStorageInterface extends ContentEntityStorageInterface {

  /**
   * Gets a list of Event code revision IDs for a specific Event code.
   *
   * @param \Drupal\cw_donations_event_codes\Entity\EventCodeInterface $entity
   *   The Event code entity.
   *
   * @return int[]
   *   Event code revision IDs (in ascending order).
   */
  public function revisionIds(EventCodeInterface $entity);

  /**
   * Gets a list of revision IDs having a given user as Event code author.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The user entity.
   *
   * @return int[]
   *   Event code revision IDs (in ascending order).
   */
  public function userRevisionIds(AccountInterface $account);

  /**
   * Counts the number of revisions in the default language.
   *
   * @param \Drupal\cw_donations_event_codes\Entity\EventCodeInterface $entity
   *   The Event code entity.
   *
   * @return int
   *   The number of revisions in the default language.
   */
  public function countDefaultLanguageRevisions(EventCodeInterface $entity);

  /**
   * Unsets the language for all Event code with the given language.
   *
   * @param \Drupal\Core\Language\LanguageInterface $language
   *   The language object.
   */
  public function clearRevisionsLanguage(LanguageInterface $language);

}
