<?php

namespace Drupal\falcon_redirect\Normalizer;

use Drupal\jsonapi\Normalizer\ContentEntityNormalizer;
use Drupal\jsonapi\ResourceType\ResourceType;
use Drupal\redirect\Entity\Redirect;

class RedirectEntityNormalizer extends ContentEntityNormalizer {

  /**
   * The interface or class that this Normalizer supports.
   *
   * @var string
   */
  protected $supportedInterfaceOrClass = Redirect::class;

  /**
   * {@inheritdoc}
   */
  protected function getFields($entity, $bundle, ResourceType $resource_type) {
    /** @var \Drupal\redirect\Entity\Redirect $entity */
    if ($bundle != 'redirect') {
      return parent::getFields($entity, $bundle, $resource_type);
    }

    $url_object = $entity->getRedirectUrl();
    $url = $url_object->toString();

    $entity->set('redirect_url', $url);
    return parent::getFields($entity, $bundle, $resource_type);
  }

}
