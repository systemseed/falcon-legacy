<?php

namespace Drupal\cw_exports;

use Drupal\Core\Database\Connection;

class ExportsCron {

  protected $connection;

  public function __construct(Connection $connection) {
    // Keep database connection object.
    $this->connection = $connection;
  }

  /**
   * Creates missing export entities.
   *
   * The logic is following: we take the last created
   * export entity (usually it's yesterday's entity)
   * and create a new one for today. In case of some
   * issues, like cron didn't run for a while - there
   * will be automatically created missing export entities
   * between the last export entity and now.
   */
  public function createExportEntities() {

    // Get the last export entity.
    $query = $this->connection->select('export_field_data');
    $query->addField('export_field_data', 'created');
    $query->orderBy('created', 'DESC');
    $query->condition('type', 'gift');
    $query->range(0, 1);
    $lastExport = $query->execute()->fetchField();

    // If there is no export entities (case relevant only for
    // the project launch) then start creation of exports
    // since today.
    if (empty($lastExport)) {
      $lastExport = REQUEST_TIME;
    }

    // Create a new date object and set it's time to the beginning
    // (12pm) of the last export day.
    $date = new \DateTime();
    $timezone = drupal_get_user_timezone();
    $date->setTimezone(new \DateTimeZone($timezone));
    $date->setTimestamp($lastExport);
    $date->modify('today');

    // Create an array of dates with 1 day difference to
    // fulfill all the gaps between the last export entity
    // and the current day.
    $date_range = [];
    do {
      $date_range[] = $date->getTimestamp();
      $date->modify('+1 day');
    } while ($date->getTimestamp() <= REQUEST_TIME);

    // Check how many export entities exist for the current range.
    // Usually it should be just 1 entity.
    $query = $this->connection->select('export_field_data');
    $query->addField('export_field_data', 'created');
    $query->condition('created', $date_range, 'IN');
    $query->condition('type', 'gift');
    $result = $query->execute();

    // Remove dates if export entity already exists for this date.
    foreach ($result as $row) {
      $key = array_search($row->created, $date_range);
      if ($key !== FALSE) {
        unset($date_range[$key]);
      }
    }

    // Create missing "Gift" type export entities.
    $entity_type_mgr = \Drupal::getContainer()->get('entity_type.manager');
    foreach ($date_range as $timestamp) {
      $entity = $entity_type_mgr->getStorage('export')->create([
        'type' => 'gift',
        'created' => $timestamp,
      ]);
      $entity->save();
    }
  }

}
