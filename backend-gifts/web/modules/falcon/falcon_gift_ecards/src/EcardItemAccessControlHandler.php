<?php

namespace Drupal\falcon_gift_ecards;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;
use Drupal\node\Plugin\views\filter\Access;

/**
 * Access controller for the E-Card Item entity.
 *
 * @see \Drupal\falcon_gift_ecards\Entity\EcardItem.
 */
class EcardItemAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\falcon_gift_ecards\Entity\EcardItemInterface $entity */
    switch ($operation) {
      case 'view':
        // NOTE: JSON API permissions are altered
        // in \Drupal\falcon_gift_ecards\Routing\RouteSubscriber.
        return AccessResult::allowedIfHasPermission($account, 'view e-card item entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit e-card item entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete e-card item entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add e-card item entities');
  }

}
