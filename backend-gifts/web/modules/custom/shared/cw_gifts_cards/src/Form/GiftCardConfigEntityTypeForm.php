<?php

namespace Drupal\cw_gifts_cards\Form;

use Drupal\Core\Entity\EntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class GiftCardConfigEntityTypeForm.
 *
 * @package Drupal\cw_gifts_cards\Form
 */
class GiftCardConfigEntityTypeForm extends EntityForm {

  /**
   * {@inheritdoc}
   */
  public function form(array $form, FormStateInterface $form_state) {
    $form = parent::form($form, $form_state);

    $gift_card_config_type = $this->entity;
    $form['label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Label'),
      '#maxlength' => 255,
      '#default_value' => $gift_card_config_type->label(),
      '#description' => $this->t("Label for the Gifts Card Configuration type."),
      '#required' => TRUE,
    ];

    $form['id'] = [
      '#type' => 'machine_name',
      '#default_value' => $gift_card_config_type->id(),
      '#machine_name' => [
        'exists' => '\Drupal\cw_gifts_cards\Entity\GiftCardConfigEntityType::load',
      ],
      '#disabled' => !$gift_card_config_type->isNew(),
    ];

    /* You will need additional form elements for your custom properties. */

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    $gift_card_config_type = $this->entity;
    $status = $gift_card_config_type->save();

    switch ($status) {
      case SAVED_NEW:
        drupal_set_message($this->t('Created the %label Gifts Card Configuration type.', [
          '%label' => $gift_card_config_type->label(),
        ]));
        break;

      default:
        drupal_set_message($this->t('Saved the %label Gifts Card Configuration type.', [
          '%label' => $gift_card_config_type->label(),
        ]));
    }
    $form_state->setRedirectUrl($gift_card_config_type->toUrl('collection'));
  }

}
