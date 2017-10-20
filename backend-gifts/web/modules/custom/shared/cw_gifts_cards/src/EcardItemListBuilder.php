<?php

namespace Drupal\cw_gifts_cards;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Routing\LinkGeneratorTrait;
use Drupal\Core\Url;

/**
 * Defines a class to build a listing of E-Card Item entities.
 *
 * @ingroup cw_gifts_cards
 */
class EcardItemListBuilder extends EntityListBuilder {

  use LinkGeneratorTrait;

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('E-Card Item ID');
    $header['name'] = $this->t('Product ID');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\cw_gifts_cards\Entity\EcardItem */
    $row['id'] = $entity->id();
    $row['name'] = $this->l(
      $entity->label(),
      new Url(
        'entity.ecard_item.edit_form', array(
          'ecard_item' => $entity->id(),
        )
      )
    );
    return $row + parent::buildRow($entity);
  }

  /**
   * Loads entity IDs using a pager sorted by the entity id (DESC).
   *
   * @return array
   *   An array of entity IDs.
   */
  protected function getEntityIds() {
    $query = $this->getStorage()->getQuery()
      ->sort($this->entityType->getKey('id'), 'DESC');

    // Only add the pager if a limit is specified.
    if ($this->limit) {
      $query->pager($this->limit);
    }
    return $query->execute();
  }
}
