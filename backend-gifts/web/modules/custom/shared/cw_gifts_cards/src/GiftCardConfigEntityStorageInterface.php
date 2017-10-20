<?php

namespace Drupal\cw_gifts_cards;

use Drupal\Core\Entity\ContentEntityStorageInterface;
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
interface GiftCardConfigEntityStorageInterface extends ContentEntityStorageInterface {

  /**
   * Gets a list of Gifts Card Configuration revision IDs for a specific Gifts Card Configuration.
   *
   * @param \Drupal\cw_gifts_cards\Entity\GiftCardConfigEntityInterface $entity
   *   The Gifts Card Configuration entity.
   *
   * @return int[]
   *   Gifts Card Configuration revision IDs (in ascending order).
   */
  public function revisionIds(GiftCardConfigEntityInterface $entity);

  /**
   * Gets a list of revision IDs having a given user as Gifts Card Configuration author.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The user entity.
   *
   * @return int[]
   *   Gifts Card Configuration revision IDs (in ascending order).
   */
  public function userRevisionIds(AccountInterface $account);

  /**
   * Counts the number of revisions in the default language.
   *
   * @param \Drupal\cw_gifts_cards\Entity\GiftCardConfigEntityInterface $entity
   *   The Gifts Card Configuration entity.
   *
   * @return int
   *   The number of revisions in the default language.
   */
  public function countDefaultLanguageRevisions(GiftCardConfigEntityInterface $entity);

  /**
   * Unsets the language for all Gifts Card Configuration with the given language.
   *
   * @param \Drupal\Core\Language\LanguageInterface $language
   *   The language object.
   */
  public function clearRevisionsLanguage(LanguageInterface $language);

}
