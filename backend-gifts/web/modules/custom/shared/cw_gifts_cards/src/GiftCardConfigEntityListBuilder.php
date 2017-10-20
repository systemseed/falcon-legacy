<?php

namespace Drupal\cw_gifts_cards;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Routing\LinkGeneratorTrait;
use Drupal\Core\Url;

/**
 * Defines a class to build a listing of Gifts Card Configuration entities.
 *
 * @ingroup cw_gifts_cards
 */
class GiftCardConfigEntityListBuilder extends EntityListBuilder {

  use LinkGeneratorTrait;

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('Gifts Card Configuration ID');
    $header['name'] = $this->t('Name');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\cw_gifts_cards\Entity\GiftCardConfigEntity */
    $row['id'] = $entity->id();
    $row['name'] = $this->l(
      $entity->label(),
      new Url(
        'entity.gift_card_config.edit_form', array(
          'gift_card_config' => $entity->id(),
        )
      )
    );
    return $row + parent::buildRow($entity);
  }

}
