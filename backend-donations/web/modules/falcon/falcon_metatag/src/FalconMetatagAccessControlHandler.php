<?php

namespace Drupal\falcon_metatag;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;

/**
 * Allows anonymous to get default Metatag entities.
 *
 * @see \Drupal\metatag\Entity\MetatagDefaults
 */
class FalconMetatagAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  public function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    if ($operation == 'view') {
      return AccessResult::allowed();
    }
    return AccessResult::allowedIfHasPermission($account, 'administer meta tags');
  }

}
