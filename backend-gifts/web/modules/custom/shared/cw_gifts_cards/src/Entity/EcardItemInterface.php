<?php

namespace Drupal\cw_gifts_cards\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining E-Card Item entities.
 *
 * @ingroup cw_gifts_cards
 */
interface EcardItemInterface extends  ContentEntityInterface, EntityOwnerInterface {

  /**
   * Gets the E-Card Item type.
   *
   * @return string
   *   The E-Card Item type.
   */
  public function getType();

}
