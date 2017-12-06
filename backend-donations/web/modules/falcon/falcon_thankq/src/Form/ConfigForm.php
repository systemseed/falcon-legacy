<?php

namespace Drupal\falcon_thankq\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class ConfigForm.
 *
 * @package Drupal\falcon_thankq\Form
 */
class ConfigForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'falcon_thankq.config',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'thankq_config_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('falcon_thankq.config');
    $form['wsdl_uri'] = [
      '#type' => 'textfield',
      '#title' => $this->t('URI to the WSDL file'),
      '#description' => '<strong>' . $this->t('URI for production is configured in <code>settings.php</code> and cannot be changed in this form.') . '</strong>',
      '#maxlength' => 255,
      '#size' => 255,
      '#default_value' => $config->get('wsdl_uri'),
    ];
    $form['error_recipients'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Errors recipients'),
      '#description' => $this->t('List of emails separated by comma. Users who receive emails in case of problems with ThankQ export.'),
      '#maxlength' => 255,
      '#size' => 255,
      '#default_value' => $config->get('error_recipients'),
    ];
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $this->config('falcon_thankq.config')
      ->set('wsdl_uri', $form_state->getValue('wsdl_uri'))
      ->set('error_recipients', $form_state->getValue('error_recipients'))
      ->save();
  }

}
