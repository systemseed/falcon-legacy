<?php

namespace Drupal\cw_donations_event_codes;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Routing\LinkGeneratorTrait;
use Drupal\Core\Url;

/**
 * Defines a class to build a listing of Event code entities.
 *
 * @ingroup cw_donations_event_codes
 */
class EventCodeListBuilder extends EntityListBuilder {
  use LinkGeneratorTrait;

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['code'] = $this->t('Event code');
    $header['label'] = $this->t('Label');
    $header['status'] = $this->t('Active');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\cw_donations_event_codes\Entity\EventCode */
    $row['code'] = $entity->getCode();
    $row['label'] = $this->l(
      $entity->label(),
      new Url(
        'entity.event_code.edit_form', array(
          'event_code' => $entity->id(),
        )
      )
    );
    $row['status'] = $entity->isPublished() ? t('Yes') : t('No');
    return $row + parent::buildRow($entity);
  }

}
