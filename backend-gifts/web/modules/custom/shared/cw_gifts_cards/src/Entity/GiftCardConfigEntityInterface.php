<?php

namespace Drupal\cw_gifts_cards\Entity;

use Drupal\Core\Entity\RevisionLogInterface;
use Drupal\Core\Entity\RevisionableInterface;
use Drupal\Component\Utility\Xss;
use Drupal\Core\Url;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Gifts Card Configuration entities.
 *
 * @ingroup cw_gifts_cards
 */
interface GiftCardConfigEntityInterface extends RevisionableInterface, RevisionLogInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Gifts Card Configuration type.
   *
   * @return string
   *   The Gifts Card Configuration type.
   */
  public function getType();
  /**
   * Gets the Gifts Card Configuration creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Gifts Card Configuration.
   */
  public function getCreatedTime();

  /**
   * Sets the Gifts Card Configuration creation timestamp.
   *
   * @param int $timestamp
   *   The Gifts Card Configuration creation timestamp.
   *
   * @return \Drupal\cw_gifts_cards\Entity\GiftCardConfigEntityInterface
   *   The called Gifts Card Configuration entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Gets the Gifts Card Configuration revision creation timestamp.
   *
   * @return int
   *   The UNIX timestamp of when this revision was created.
   */
  public function getRevisionCreationTime();

  /**
   * Sets the Gifts Card Configuration revision creation timestamp.
   *
   * @param int $timestamp
   *   The UNIX timestamp of when this revision was created.
   *
   * @return \Drupal\cw_gifts_cards\Entity\GiftCardConfigEntityInterface
   *   The called Gifts Card Configuration entity.
   */
  public function setRevisionCreationTime($timestamp);

  /**
   * Gets the Gifts Card Configuration revision author.
   *
   * @return \Drupal\user\UserInterface
   *   The user entity for the revision author.
   */
  public function getRevisionUser();

  /**
   * Sets the Gifts Card Configuration revision author.
   *
   * @param int $uid
   *   The user ID of the revision author.
   *
   * @return \Drupal\cw_gifts_cards\Entity\GiftCardConfigEntityInterface
   *   The called Gifts Card Configuration entity.
   */
  public function setRevisionUserId($uid);

}
