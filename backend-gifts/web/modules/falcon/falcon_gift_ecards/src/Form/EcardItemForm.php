<?php

namespace Drupal\falcon_gift_ecards\Form;

use Drupal\Core\Entity\ContentEntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Form controller for E-Card Item edit forms.
 *
 * @ingroup falcon_gift_ecards
 */
class EcardItemForm extends ContentEntityForm {

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    /* @var $entity \Drupal\falcon_gift_ecards\Entity\EcardItem */
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
