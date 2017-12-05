<?php

namespace Drupal\falcon_event_codes\Entity;

use Drupal\views\EntityViewsData;

/**
 * Provides Views data for Event code entities.
 */
class EventCodeViewsData extends EntityViewsData {

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
