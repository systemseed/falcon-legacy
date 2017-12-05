<?php

/**
 * @file
 * Contains gift_card_config.page.inc.
 *
 * Page callback for Gifts Card Configuration entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for Gifts Card Configuration templates.
 *
 * Default template: gift_card_config.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_gift_card_config(array &$variables) {
  // Fetch GiftCardConfigEntity Entity Object.
  $gift_card_config = $variables['elements']['#gift_card_config'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
