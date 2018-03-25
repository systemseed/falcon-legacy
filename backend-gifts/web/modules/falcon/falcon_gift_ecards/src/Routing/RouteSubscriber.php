<?php

namespace Drupal\falcon_gift_ecards\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

/**
 * Class RouteSubscriber.
 *
 * @package Drupal\falcon_gift_ecards\Routing
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    $route = $collection->get('jsonapi.ecard_item--gift.collection');

    // Disable GET for list of e-cards.
    if (!empty($route)) {
      // Disable GET for list of e-cards.
      $route->setMethods(['POST', 'PATCH']);
      $collection->add('jsonapi.ecard_item--gift.collection', $route);
    }
  }

}
