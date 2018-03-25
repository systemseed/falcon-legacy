<?php

namespace Drupal\falcon_gift_ecards\Form;

use Drupal\Core\Entity\EntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class EcardItemTypeForm.
 *
 * @package Drupal\falcon_gift_ecards\Form
 */
class EcardItemTypeForm extends EntityForm {

  /**
   * {@inheritdoc}
   */
  public function form(array $form, FormStateInterface $form_state) {
    $form = parent::form($form, $form_state);

    $ecard_item_type = $this->entity;
    $form['label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Label'),
      '#maxlength' => 255,
      '#default_value' => $ecard_item_type->label(),
      '#description' => $this->t("Label for the E-Card Item type."),
      '#required' => TRUE,
    ];

    $form['id'] = [
      '#type' => 'machine_name',
      '#default_value' => $ecard_item_type->id(),
      '#machine_name' => [
        'exists' => '\Drupal\falcon_gift_ecards\Entity\EcardItemType::load',
      ],
      '#disabled' => !$ecard_item_type->isNew(),
    ];

    /* You will need additional form elements for your custom properties. */

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    $ecard_item_type = $this->entity;
    $status = $ecard_item_type->save();

    switch ($status) {
      case SAVED_NEW:
        drupal_set_message($this->t('Created the %label E-Card Item type.', [
          '%label' => $ecard_item_type->label(),
        ]));
        break;

      default:
        drupal_set_message($this->t('Saved the %label E-Card Item type.', [
          '%label' => $ecard_item_type->label(),
        ]));
    }
    $form_state->setRedirectUrl($ecard_item_type->toUrl('collection'));
  }

}
