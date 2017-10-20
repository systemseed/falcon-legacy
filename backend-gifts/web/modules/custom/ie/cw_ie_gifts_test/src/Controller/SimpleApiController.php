<?php

namespace Drupal\cw_ie_gifts_test\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class SimpleApiController.
 *
 * @package Drupal\cw_ie_gifts_test\Controller
 */
class SimpleApiController extends ControllerBase {

  /**
   * GET method.
   *
   * @return string
   */
  public function get() {

    return new JsonResponse(['ie' => TRUE]);
  }

}
