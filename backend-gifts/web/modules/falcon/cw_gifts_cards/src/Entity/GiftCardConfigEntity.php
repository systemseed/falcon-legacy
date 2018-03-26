<?php

namespace Drupal\cw_gifts_cards\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\RevisionableContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the Gifts Card Configuration entity.
 *
 * @ingroup cw_gifts_cards
 *
 * @ContentEntityType(
 *   id = "gift_card_config",
 *   label = @Translation("Gifts Card Configuration"),
 *   bundle_label = @Translation("Gifts Card Configuration type"),
 *   handlers = {
 *     "storage" = "Drupal\cw_gifts_cards\GiftCardConfigEntityStorage",
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\cw_gifts_cards\GiftCardConfigEntityListBuilder",
 *     "views_data" = "Drupal\cw_gifts_cards\Entity\GiftCardConfigEntityViewsData",
 *
 *     "form" = {
 *       "default" = "Drupal\cw_gifts_cards\Form\GiftCardConfigEntityForm",
 *       "add" = "Drupal\cw_gifts_cards\Form\GiftCardConfigEntityForm",
 *       "edit" = "Drupal\cw_gifts_cards\Form\GiftCardConfigEntityForm",
 *       "delete" = "Drupal\cw_gifts_cards\Form\GiftCardConfigEntityDeleteForm",
 *     },
 *     "access" = "Drupal\cw_gifts_cards\GiftCardConfigEntityAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\cw_gifts_cards\GiftCardConfigEntityHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "gift_card_config",
 *   revision_table = "gift_card_config_revision",
 *   revision_data_table = "gift_card_config_field_revision",
 *   admin_permission = "administer gifts card configuration entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "revision" = "vid",
 *     "bundle" = "type",
 *     "label" = "donations_product_uuid",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *   },
 *   links = {
 *     "canonical" = "/admin/content/gift-cards/gift_card_config/{gift_card_config}",
 *     "add-page" = "/admin/content/gift-cards/gift_card_config/add",
 *     "add-form" = "/admin/content/gift-cards/gift_card_config/add/{gift_card_config_type}",
 *     "edit-form" = "/admin/content/gift-cards/gift_card_config/{gift_card_config}/edit",
 *     "delete-form" = "/admin/content/gift-cards/gift_card_config/{gift_card_config}/delete",
 *     "version-history" = "/admin/content/gift-cards/gift_card_config/{gift_card_config}/revisions",
 *     "revision" = "/admin/content/gift-cards/gift_card_config/{gift_card_config}/revisions/{gift_card_config_revision}/view",
 *     "collection" = "/admin/content/gift-cards/gift_card_config",
 *   },
 *   bundle_entity_type = "gift_card_config_type",
 *   field_ui_base_route = "entity.gift_card_config_type.edit_form"
 * )
 */
class GiftCardConfigEntity extends RevisionableContentEntityBase implements GiftCardConfigEntityInterface {

  use EntityChangedTrait;

  /**
   * {@inheritdoc}
   */
  public static function preCreate(EntityStorageInterface $storage_controller, array &$values) {
    parent::preCreate($storage_controller, $values);
    $values += array(
      'user_id' => \Drupal::currentUser()->id(),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function preSave(EntityStorageInterface $storage) {
    parent::preSave($storage);

    foreach (array_keys($this->getTranslationLanguages()) as $langcode) {
      $translation = $this->getTranslation($langcode);

      // If no owner has been set explicitly, make the anonymous user the owner.
      if (!$translation->getOwner()) {
        $translation->setOwnerId(0);
      }
    }

    // If no revision author has been set explicitly, make the gift_card_config owner the
    // revision author.
    if (!$this->getRevisionUser()) {
      $this->setRevisionUserId($this->getOwnerId());
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getType() {
    return $this->bundle();
  }

  /**
   * {@inheritdoc}
   */
  public function getName() {
    return $this->get('donations_product_uuid')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function getCreatedTime() {
    return $this->get('created')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setCreatedTime($timestamp) {
    $this->set('created', $timestamp);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwner() {
    return $this->get('user_id')->entity;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwnerId() {
    return $this->get('user_id')->target_id;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwnerId($uid) {
    $this->set('user_id', $uid);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwner(UserInterface $account) {
    $this->set('user_id', $account->id());
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getRevisionCreationTime() {
    return $this->get('revision_timestamp')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setRevisionCreationTime($timestamp) {
    $this->set('revision_timestamp', $timestamp);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getRevisionUser() {
    return $this->get('revision_uid')->entity;
  }

  /**
   * {@inheritdoc}
   */
  public function setRevisionUserId($uid) {
    $this->set('revision_uid', $uid);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['user_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Authored by'))
      ->setDescription(t('The user ID of author of the Gifts Card Configuration entity.'))
      ->setRevisionable(TRUE)
      ->setSetting('target_type', 'user')
      ->setSetting('handler', 'default')
      ->setDisplayOptions('view', array(
        'label' => 'hidden',
        'type' => 'author',
        'weight' => 0,
      ));

    $fields['donations_product_uuid'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Product UUID'))
      ->setDescription(t('Product UUID in Donations service.'))
      ->setRevisionable(FALSE)
      ->setDefaultValue('')
      ->setSetting('max_length', 255)
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'string',
        'weight' => -5,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -5,
      ]);

    $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Created'))
      ->setDescription(t('The time that the entity was created.'));

    $fields['changed'] = BaseFieldDefinition::create('changed')
      ->setLabel(t('Changed'))
      ->setDescription(t('The time that the entity was last edited.'));

    $fields['revision_timestamp'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Revision timestamp'))
      ->setDescription(t('The time that the current revision was created.'))
      ->setQueryable(FALSE)
      ->setRevisionable(TRUE);

    $fields['revision_uid'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Revision user ID'))
      ->setDescription(t('The user ID of the author of the current revision.'))
      ->setSetting('target_type', 'user')
      ->setQueryable(FALSE)
      ->setRevisionable(TRUE);

    return $fields;
  }

}
