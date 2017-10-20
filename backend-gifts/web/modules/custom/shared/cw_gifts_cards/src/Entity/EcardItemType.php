<?php

namespace Drupal\cw_gifts_cards\Entity;

use Drupal\Core\Config\Entity\ConfigEntityBundleBase;

/**
 * Defines the E-Card Item type entity.
 *
 * @ConfigEntityType(
 *   id = "ecard_item_type",
 *   label = @Translation("E-Card Item type"),
 *   handlers = {
 *     "list_builder" = "Drupal\cw_gifts_cards\EcardItemTypeListBuilder",
 *     "form" = {
 *       "add" = "Drupal\cw_gifts_cards\Form\EcardItemTypeForm",
 *       "edit" = "Drupal\cw_gifts_cards\Form\EcardItemTypeForm",
 *       "delete" = "Drupal\cw_gifts_cards\Form\EcardItemTypeDeleteForm"
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\cw_gifts_cards\EcardItemTypeHtmlRouteProvider",
 *     },
 *   },
 *   config_prefix = "ecard_item_type",
 *   admin_permission = "administer site configuration",
 *   bundle_of = "ecard_item",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "label",
 *     "uuid" = "uuid"
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/ecard_item_type/{ecard_item_type}",
 *     "add-form" = "/admin/structure/ecard_item_type/add",
 *     "edit-form" = "/admin/structure/ecard_item_type/{ecard_item_type}/edit",
 *     "delete-form" = "/admin/structure/ecard_item_type/{ecard_item_type}/delete",
 *     "collection" = "/admin/structure/ecard_item_type"
 *   }
 * )
 */
class EcardItemType extends ConfigEntityBundleBase implements EcardItemTypeInterface {

  /**
   * The E-Card Item type ID.
   *
   * @var string
   */
  protected $id;

  /**
   * The E-Card Item type label.
   *
   * @var string
   */
  protected $label;

}
