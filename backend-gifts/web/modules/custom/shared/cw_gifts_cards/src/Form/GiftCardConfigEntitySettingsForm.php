<?php

namespace Drupal\cw_gifts_cards\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class GiftCardConfigEntitySettingsForm.
 *
 * @package Drupal\cw_gifts_cards\Form
 *
 * @ingroup cw_gifts_cards
 */
class GiftCardConfigEntitySettingsForm extends FormBase {

  /**
   * Returns a unique string identifying the form.
   *
   * @return string
   *   The unique string identifying the form.
   */
  public function getFormId() {
    return 'GiftCardConfigEntity_settings';
  }

  /**
   * Form submission handler.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Empty implementation of the abstract submit class.
  }

  /**
   * Defines the settings form for Gifts Card Configuration entities.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   *
   * @return array
   *   Form definition array.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['GiftCardConfigEntity_settings']['#markup'] = 'Settings form for Gifts Card Configuration entities. Manage field settings here.';
    return $form;
  }

}
