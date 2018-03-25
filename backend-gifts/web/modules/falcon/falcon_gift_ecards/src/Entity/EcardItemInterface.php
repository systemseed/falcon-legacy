<?php

namespace Drupal\falcon_gift_ecards\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining E-Card Item entities.
 *
 * @ingroup falcon_gift_ecards
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
