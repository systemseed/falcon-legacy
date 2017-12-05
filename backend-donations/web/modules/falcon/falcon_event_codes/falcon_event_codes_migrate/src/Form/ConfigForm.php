<?php

namespace Drupal\falcon_event_codes_migrate\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\file\Entity\File;
use Drupal\migrate_plus\Entity\Migration;

/**
 * Class ConfigForm.
 *
 * @package Drupal\falcon_event_codes_migrate\Form
 */
class ConfigForm extends FormBase {


  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'config_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['csv_file'] = [
      '#type' => 'managed_file',
      '#required' => TRUE,
      '#title' => $this->t('CSV file'),
      '#description' => $this->t('File with the following header: <code>Source Code;Name;Type;Region;Campaign;Active;Should Appear in Online Dropdown?;Updated By;Updated Date;;
</code>'),
      '#upload_validators' => array(
        'file_validate_extensions' => array('csv'),
      ),
      '#upload_location' => 'private://eventcodes/',
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Upload'),
    ];

    $form['help']['#markup'] = '<p>It will just upload the file. You will need to run migration manually via drush:</p><p><code>drush cr && drush migrate-import falcon_event_codes_csv --update</code></p>';

    return $form;
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
    $file_uri = File::load($form_state->getValue('csv_file')[0])->getFileUri();

    $csv_migration = Migration::load('falcon_event_codes_csv');
    $source = $csv_migration->get('source');
    $source['path'] = $file_uri;
    $csv_migration->set('source', $source);
    $csv_migration->save();
    drupal_set_message($this->t('File uploaded. You can now run falcon_event_codes_csv migration via drush.'));

  }

}
