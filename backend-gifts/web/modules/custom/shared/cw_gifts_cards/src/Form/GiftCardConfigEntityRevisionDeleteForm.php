<?php

namespace Drupal\cw_gifts_cards\Form;

use Drupal\Core\Database\Connection;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Form\ConfirmFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a form for deleting a Gifts Card Configuration revision.
 *
 * @ingroup cw_gifts_cards
 */
class GiftCardConfigEntityRevisionDeleteForm extends ConfirmFormBase {


  /**
   * The Gifts Card Configuration revision.
   *
   * @var \Drupal\cw_gifts_cards\Entity\GiftCardConfigEntityInterface
   */
  protected $revision;

  /**
   * The Gifts Card Configuration storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $GiftCardConfigEntityStorage;

  /**
   * The database connection.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected $connection;

  /**
   * Constructs a new GiftCardConfigEntityRevisionDeleteForm.
   *
   * @param \Drupal\Core\Entity\EntityStorageInterface $entity_storage
   *   The entity storage.
   * @param \Drupal\Core\Database\Connection $connection
   *   The database connection.
   */
  public function __construct(EntityStorageInterface $entity_storage, Connection $connection) {
    $this->GiftCardConfigEntityStorage = $entity_storage;
    $this->connection = $connection;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    $entity_manager = $container->get('entity.manager');
    return new static(
      $entity_manager->getStorage('gift_card_config'),
      $container->get('database')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'gift_card_config_revision_delete_confirm';
  }

  /**
   * {@inheritdoc}
   */
  public function getQuestion() {
    return t('Are you sure you want to delete the revision from %revision-date?', array('%revision-date' => format_date($this->revision->getRevisionCreationTime())));
  }

  /**
   * {@inheritdoc}
   */
  public function getCancelUrl() {
    return new Url('entity.gift_card_config.version_history', array('gift_card_config' => $this->revision->id()));
  }

  /**
   * {@inheritdoc}
   */
  public function getConfirmText() {
    return t('Delete');
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $gift_card_config_revision = NULL) {
    $this->revision = $this->GiftCardConfigEntityStorage->loadRevision($gift_card_config_revision);
    $form = parent::buildForm($form, $form_state);

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->GiftCardConfigEntityStorage->deleteRevision($this->revision->getRevisionId());

    $this->logger('content')->notice('Gifts Card Configuration: deleted %title revision %revision.', array('%title' => $this->revision->label(), '%revision' => $this->revision->getRevisionId()));
    drupal_set_message(t('Revision from %revision-date of Gifts Card Configuration %title has been deleted.', array('%revision-date' => format_date($this->revision->getRevisionCreationTime()), '%title' => $this->revision->label())));
    $form_state->setRedirect(
      'entity.gift_card_config.canonical',
       array('gift_card_config' => $this->revision->id())
    );
    if ($this->connection->query('SELECT COUNT(DISTINCT vid) FROM {gift_card_config_field_revision} WHERE id = :id', array(':id' => $this->revision->id()))->fetchField() > 1) {
      $form_state->setRedirect(
        'entity.gift_card_config.version_history',
         array('gift_card_config' => $this->revision->id())
      );
    }
  }

}
