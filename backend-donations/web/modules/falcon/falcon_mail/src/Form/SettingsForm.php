<?php

namespace Drupal\falcon_mail\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class SettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'falcon_mail_admin_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'falcon_mail.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildForm($form, $form_state);
    $config = $this->config('falcon_mail.settings');

    $form['notifications'] = [
      '#type' => 'details',
      '#title' => $this->t('Notifications'),
      '#open' => TRUE,
    ];
    $form['notifications']['list_gift_corporate'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Corporate gift order'),
      '#description' => $this->t('Email addresses to notify about corporate gift order. Separate several values by comma.'),
      '#default_value' => $config->get('notifications.list_gift_corporate'),
      '#size' => 128,
      '#maxlength' => 256,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $this->config('falcon_mail.settings')
      ->set('notifications.list_gift_corporate', $form_state->getValue('list_gift_corporate'))
      ->save();
  }

}
