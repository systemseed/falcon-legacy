<?php

/**
 * @file
 * Contains ecard_item.page.inc.
 *
 * Page callback for E-Card Item entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for E-Card Item templates.
 *
 * Default template: ecard_item.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_ecard_item(array &$variables) {
  // Fetch EcardItem Entity Object.
  $ecard_item = $variables['elements']['#ecard_item'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
