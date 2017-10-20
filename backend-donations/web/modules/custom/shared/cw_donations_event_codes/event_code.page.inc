<?php

/**
 * @file
 * Contains event_code.page.inc.
 *
 * Page callback for Event code entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for Event code templates.
 *
 * Default template: event_code.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_event_code(array &$variables) {
  // Fetch EventCode Entity Object.
  $event_code = $variables['elements']['#event_code'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
