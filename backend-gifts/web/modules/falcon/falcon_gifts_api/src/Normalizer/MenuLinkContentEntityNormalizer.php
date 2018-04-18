<?php

namespace Drupal\falcon_gifts_api\Normalizer;

use Drupal\jsonapi\Normalizer\ContentEntityNormalizer;
use Drupal\jsonapi\ResourceType\ResourceType;
use Drupal\menu_link_content\MenuLinkContentInterface;

class MenuLinkContentEntityNormalizer extends ContentEntityNormalizer {

  /**
   * The interface or class that this Normalizer supports.
   *
   * @var string
   */
  protected $supportedInterfaceOrClass = MenuLinkContentInterface::class;

  /**
   * {@inheritdoc}
   */
  protected function getFields($entity, $bundle, ResourceType $resource_type) {
    /** @var \Drupal\menu_link_content\MenuLinkContentInterface $entity */
    if ($bundle != 'menu_link_content') {
      return parent::getFields($entity, $bundle, $resource_type);
    }

    // Check access to node if it is a link to node entity.
    $url_object = $entity->getUrlObject();
    $url = $url_object->toString();
    if ($url_object->isRouted() && ($params = $url_object->getRouteParameters()) && isset($params['node'])) {
      $node = $this->entityTypeManager->getStorage('node')->load($params['node']);
      if (!$node->access('view')) {
        $url = null;
      }
    }

    $entity->set('url', $url);
    return parent::getFields($entity, $bundle, $resource_type);
  }

}
