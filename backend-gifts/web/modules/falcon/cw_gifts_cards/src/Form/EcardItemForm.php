<?php

namespace Drupal\cw_gifts_cards\Form;

use Drupal\Core\Entity\ContentEntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Form controller for E-Card Item edit forms.
 *
 * @ingroup cw_gifts_cards
 */
class EcardItemForm extends ContentEntityForm {

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    /* @var $entity \Drupal\cw_gifts_cards\Entity\EcardItem */
    $form = parent::buildForm($form, $form_state);

    $entity = $this->entity;

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    $entity = &$this->entity;

    $status = parent::save($form, $form_state);

    switch ($status) {
      case SAVED_NEW:
        drupal_set_message($this->t('Created the %label E-Card Item.', [
          '%label' => $entity->label(),
        ]));
        break;

      default:
        drupal_set_message($this->t('Saved the %label E-Card Item.', [
          '%label' => $entity->label(),
        ]));
    }
    $form_state->setRedirect('entity.ecard_item.canonical', ['ecard_item' => $entity->id()]);
  }

}
