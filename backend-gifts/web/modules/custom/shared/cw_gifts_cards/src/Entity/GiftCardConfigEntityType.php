<?php

namespace Drupal\cw_gifts_cards\Entity;

use Drupal\Core\Config\Entity\ConfigEntityBundleBase;

/**
 * Defines the Gifts Card Configuration type entity.
 *
 * @ConfigEntityType(
 *   id = "gift_card_config_type",
 *   label = @Translation("Gifts Card Configuration type"),
 *   handlers = {
 *     "list_builder" = "Drupal\cw_gifts_cards\GiftCardConfigEntityTypeListBuilder",
 *     "form" = {
 *       "add" = "Drupal\cw_gifts_cards\Form\GiftCardConfigEntityTypeForm",
 *       "edit" = "Drupal\cw_gifts_cards\Form\GiftCardConfigEntityTypeForm",
 *       "delete" = "Drupal\cw_gifts_cards\Form\GiftCardConfigEntityTypeDeleteForm"
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\cw_gifts_cards\GiftCardConfigEntityTypeHtmlRouteProvider",
 *     },
 *   },
 *   config_prefix = "gift_card_config_type",
 *   admin_permission = "administer site configuration",
 *   bundle_of = "gift_card_config",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "label",
 *     "uuid" = "uuid"
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/gift_card_config_type/{gift_card_config_type}",
 *     "add-form" = "/admin/structure/gift_card_config_type/add",
 *     "edit-form" = "/admin/structure/gift_card_config_type/{gift_card_config_type}/edit",
 *     "delete-form" = "/admin/structure/gift_card_config_type/{gift_card_config_type}/delete",
 *     "collection" = "/admin/structure/gift_card_config_type"
 *   }
 * )
 */
class GiftCardConfigEntityType extends ConfigEntityBundleBase implements GiftCardConfigEntityTypeInterface {

  /**
   * The Gifts Card Configuration type ID.
   *
   * @var string
   */
  protected $id;

  /**
   * The Gifts Card Configuration type label.
   *
   * @var string
   */
  protected $label;

}
