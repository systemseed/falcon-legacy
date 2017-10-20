<?php

namespace Drupal\cw_gifts_cards;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Gifts Card Configuration entity.
 *
 * @see \Drupal\cw_gifts_cards\Entity\GiftCardConfigEntity.
 */
class GiftCardConfigEntityAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\cw_gifts_cards\Entity\GiftCardConfigEntityInterface $entity */
    switch ($operation) {
      case 'view':
        return AccessResult::allowedIfHasPermission($account, 'view gifts card configuration entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit gifts card configuration entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete gifts card configuration entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add gifts card configuration entities');
  }

}
