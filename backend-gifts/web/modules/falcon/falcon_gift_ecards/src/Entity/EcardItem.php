<?php

namespace Drupal\falcon_gift_ecards\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the E-Card Item entity.
 *
 * @ingroup falcon_gift_ecards
 *
 * @ContentEntityType(
 *   id = "ecard_item",
 *   label = @Translation("E-Card Item"),
 *   bundle_label = @Translation("E-Card Item type"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\falcon_gift_ecards\EcardItemListBuilder",
 *     "views_data" = "Drupal\falcon_gift_ecards\Entity\EcardItemViewsData",
 *
 *     "form" = {
 *       "default" = "Drupal\falcon_gift_ecards\Form\EcardItemForm",
 *       "add" = "Drupal\falcon_gift_ecards\Form\EcardItemForm",
 *       "edit" = "Drupal\falcon_gift_ecards\Form\EcardItemForm",
 *       "delete" = "Drupal\falcon_gift_ecards\Form\EcardItemDeleteForm",
 *     },
 *     "access" = "Drupal\falcon_gift_ecards\EcardItemAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\falcon_gift_ecards\EcardItemHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "ecard_item",
 *   admin_permission = "administer e-card item entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "bundle" = "type",
 *     "label" = "donations_product_uuid",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/ecard_item/{ecard_item}",
 *     "add-page" = "/admin/structure/ecard_item/add",
 *     "add-form" = "/admin/structure/ecard_item/add/{ecard_item_type}",
 *     "edit-form" = "/admin/structure/ecard_item/{ecard_item}/edit",
 *     "delete-form" = "/admin/structure/ecard_item/{ecard_item}/delete",
 *     "collection" = "/admin/structure/ecard_item",
 *   },
 *   bundle_entity_type = "ecard_item_type",
 *   field_ui_base_route = "entity.ecard_item_type.edit_form"
 * )
 */
class EcardItem extends ContentEntityBase implements EcardItemInterface {

  /**
   * {@inheritdoc}
   */
  public static function preCreate(EntityStorageInterface $storage_controller, array &$values) {
    parent::preCreate($storage_controller, $values);
    $values += array(
      'user_id' => \Drupal::currentUser()->id(),
      // Set default sending timestamp to now.
      'sending_timestamp' => strtotime('00:00'),
    );
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
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['user_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Authored by'))
      ->setDescription(t('The user ID of author of the E-Card Item entity.'))
      ->setRevisionable(TRUE)
      ->setSetting('target_type', 'user')
      ->setSetting('handler', 'default')
      ->setDisplayOptions('view', array(
        'label' => 'hidden',
        'type' => 'author',
        'weight' => 0,
      ))
      ->setDisplayOptions('form', array(
        'type' => 'entity_reference_autocomplete',
        'weight' => 5,
        'settings' => array(
          'match_operator' => 'CONTAINS',
          'size' => '60',
          'autocomplete_type' => 'tags',
          'placeholder' => '',
        ),
      ))
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['donations_order_uuid'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Order UUID'))
      ->setDescription(t('Order UUID in Donations service.'))
      ->setDefaultValue('');

    $fields['donations_product_uuid'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Product UUID'))
      ->setDescription(t('Product UUID in Donations service.'))
      ->setDefaultValue('');

    $fields['sending_status'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t('Sending status'))
      ->setDescription(t('Sending status. TRUE if sent.'))
      ->setDefaultValue(FALSE);

    $fields['sending_timestamp'] = BaseFieldDefinition::create('timestamp')
      ->setLabel(t('Scheduled sending time'))
      ->setDescription(t('Scheduled sending time.'))
      ->setDefaultValue(0);

    $fields['sent_timestamp'] = BaseFieldDefinition::create('timestamp')
      ->setLabel(t('Sent time'))
      ->setDescription(t('Time when entity was sent.'))
      ->setDefaultValue(0);

    return $fields;
  }

  /**
   * Check if this card item sending status and date allow to send it now.
   *
   * @return bool
   *   TRUE if card should be sent.
   */
  public function canSendNow() {
    return ($this->get('sending_status')->value === FALSE) && ($this->get('sending_timestamp')->value <= REQUEST_TIME);
  }

}
