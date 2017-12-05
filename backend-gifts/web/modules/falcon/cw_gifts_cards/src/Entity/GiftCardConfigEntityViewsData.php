<?php

namespace Drupal\cw_gifts_cards\Entity;

use Drupal\views\EntityViewsData;

/**
 * Provides Views data for Gifts Card Configuration entities.
 */
class GiftCardConfigEntityViewsData extends EntityViewsData {

  /**
   * {@inheritdoc}
   */
  public function getViewsData() {
    $data = parent::getViewsData();

    // Additional information for Views integration, such as table joins, can be
    // put here.

    return $data;
  }

}
