<?php

namespace Drupal\cw_donations_event_codes\Entity;

use Drupal\Core\Entity\RevisionLogInterface;
use Drupal\Core\Entity\RevisionableInterface;
use Drupal\Component\Utility\Xss;
use Drupal\Core\Url;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Event code entities.
 *
 * @ingroup cw_donations_event_codes
 */
interface EventCodeInterface extends RevisionableInterface, RevisionLogInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Event code.
   *
   * @return string
   *   Code of the Event code.
   */
  public function getCode();

  /**
   * Sets the Event code.
   *
   * @param string $code
   *   The Event code code.
   *
   * @return \Drupal\cw_donations_event_codes\Entity\EventCodeInterface
   *   The called Event code entity.
   */
  public function setCode($code);

  /**
   * Gets the Event code creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Event code.
   */
  public function getCreatedTime();

  /**
   * Sets the Event code creation timestamp.
   *
   * @param int $timestamp
   *   The Event code creation timestamp.
   *
   * @return \Drupal\cw_donations_event_codes\Entity\EventCodeInterface
   *   The called Event code entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Event code published status indicator.
   *
   * Unpublished Event code are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Event code is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Event code.
   *
   * @param bool $published
   *   TRUE to set this Event code to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\cw_donations_event_codes\Entity\EventCodeInterface
   *   The called Event code entity.
   */
  public function setPublished($published);

  /**
   * Gets the Event code revision creation timestamp.
   *
   * @return int
   *   The UNIX timestamp of when this revision was created.
   */
  public function getRevisionCreationTime();

  /**
   * Sets the Event code revision creation timestamp.
   *
   * @param int $timestamp
   *   The UNIX timestamp of when this revision was created.
   *
   * @return \Drupal\cw_donations_event_codes\Entity\EventCodeInterface
   *   The called Event code entity.
   */
  public function setRevisionCreationTime($timestamp);

  /**
   * Gets the Event code revision author.
   *
   * @return \Drupal\user\UserInterface
   *   The user entity for the revision author.
   */
  public function getRevisionUser();

  /**
   * Sets the Event code revision author.
   *
   * @param int $uid
   *   The user ID of the revision author.
   *
   * @return \Drupal\cw_donations_event_codes\Entity\EventCodeInterface
   *   The called Event code entity.
   */
  public function setRevisionUserId($uid);

}
