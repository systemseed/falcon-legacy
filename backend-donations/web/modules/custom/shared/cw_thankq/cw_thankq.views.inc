<?php

/**
 * @file
 * Contains cw_thankq\cw_thankq.views.inc..
 * Provide a custom views field data that isn't tied to any other module. */

use Drupal\Component\Utility\NestedArray;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\Sql\SqlContentEntityStorage;
use Drupal\Core\Render\Markup;
use Drupal\field\FieldConfigInterface;
use Drupal\field\FieldStorageConfigInterface;
use Drupal\system\ActionConfigEntityInterface;

/**
 * Implements hook_views_data_alter().
 */
function cw_thankq_views_data_alter(array &$data) {
  // Add new field to exports entities.
  $data['export']['thankq_status_field'] = [
    'title' => t('ThankQ Status'),
    'help' => t("Output summary for Exports entity."),
    'field' => [
      'id' => 'thankq_status_field',
    ],
  ];
}
