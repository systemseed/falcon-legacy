<?php

namespace Drupal\cw_donations_event_codes;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Event code entity.
 *
 * @see \Drupal\cw_donations_event_codes\Entity\EventCode.
 */
class EventCodeAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\cw_donations_event_codes\Entity\EventCodeInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished event code entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published event code entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit event code entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete event code entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add event code entities');
  }

}
