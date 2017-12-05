<?php

namespace Drupal\falcon_thankq\Plugin\views\field;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Utility\Random;
use Drupal\falcon_thankq\OrderProcessor\GiftsOrderProcessor;
use Drupal\eck\Entity\EckEntity;
use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;

/**
 * A handler to provide a field that is completely custom by the administrator.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("thankq_status_field")
 *
 * TODO: figure out how to enable back view cache and keep statistics up to date.
 */
class ThankQStatusField extends FieldPluginBase {

  /* @var GiftsOrderProcessor */
  protected $processor;

  public function __construct(array $configuration, $plugin_id, $plugin_definition) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);

    $this->processor = new GiftsOrderProcessor();
  }


  /**
   * {@inheritdoc}
   */
  public function usesGroupBy() {
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function query() {
    // Do nothing -- to override the parent query.
  }

  /**
   * {@inheritdoc}
   */
  public function buildOptionsForm(&$form, FormStateInterface $form_state) {
    parent::buildOptionsForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function render(ResultRow $values) {

    /* @var \Drupal\eck\Entity\EckEntity $entity */
    $entity = $values->_entity;

    // Only Gifts supported at the moment.
    if ($entity->bundle() == 'gift') {
      return $this->renderGift($entity);
    }

    return '';

  }

  /**
   * Helper to render stats for Gift exports.
   *
   * @param \Drupal\eck\Entity\EckEntity $entity
   * @return array
   */
  public function renderGift(EckEntity $entity) {
    return [
      '#markup' => $this->processor->getDailySummary(date('Y-m-d', $entity->created->value)),
    ];
  }

}
