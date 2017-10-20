<?php

namespace Drupal\cw_gifts_cards\Controller;

use Drupal\Component\Utility\Xss;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Url;
use Drupal\cw_gifts_cards\Entity\GiftCardConfigEntityInterface;

/**
 * Class GiftCardConfigEntityController.
 *
 *  Returns responses for Gifts Card Configuration routes.
 *
 * @package Drupal\cw_gifts_cards\Controller
 */
class GiftCardConfigEntityController extends ControllerBase implements ContainerInjectionInterface {

  /**
   * Displays a Gifts Card Configuration  revision.
   *
   * @param int $gift_card_config_revision
   *   The Gifts Card Configuration  revision ID.
   *
   * @return array
   *   An array suitable for drupal_render().
   */
  public function revisionShow($gift_card_config_revision) {
    $gift_card_config = $this->entityManager()->getStorage('gift_card_config')->loadRevision($gift_card_config_revision);
    $view_builder = $this->entityManager()->getViewBuilder('gift_card_config');

    return $view_builder->view($gift_card_config);
  }

  /**
   * Page title callback for a Gifts Card Configuration  revision.
   *
   * @param int $gift_card_config_revision
   *   The Gifts Card Configuration  revision ID.
   *
   * @return string
   *   The page title.
   */
  public function revisionPageTitle($gift_card_config_revision) {
    $gift_card_config = $this->entityManager()->getStorage('gift_card_config')->loadRevision($gift_card_config_revision);
    return $this->t('Revision of %title from %date', array('%title' => $gift_card_config->label(), '%date' => format_date($gift_card_config->getRevisionCreationTime())));
  }

  /**
   * Generates an overview table of older revisions of a Gifts Card Configuration .
   *
   * @param \Drupal\cw_gifts_cards\Entity\GiftCardConfigEntityInterface $gift_card_config
   *   A Gifts Card Configuration  object.
   *
   * @return array
   *   An array as expected by drupal_render().
   */
  public function revisionOverview(GiftCardConfigEntityInterface $gift_card_config) {
    $account = $this->currentUser();
    $langcode = $gift_card_config->language()->getId();
    $langname = $gift_card_config->language()->getName();
    $languages = $gift_card_config->getTranslationLanguages();
    $has_translations = (count($languages) > 1);
    $gift_card_config_storage = $this->entityManager()->getStorage('gift_card_config');

    $build['#title'] = $has_translations ? $this->t('@langname revisions for %title', ['@langname' => $langname, '%title' => $gift_card_config->label()]) : $this->t('Revisions for %title', ['%title' => $gift_card_config->label()]);
    $header = array($this->t('Revision'), $this->t('Operations'));

    $revert_permission = (($account->hasPermission("revert all gifts card configuration revisions") || $account->hasPermission('administer gifts card configuration entities')));
    $delete_permission = (($account->hasPermission("delete all gifts card configuration revisions") || $account->hasPermission('administer gifts card configuration entities')));

    $rows = array();

    $vids = $gift_card_config_storage->revisionIds($gift_card_config);

    $latest_revision = TRUE;

    foreach (array_reverse($vids) as $vid) {
      /** @var \Drupal\cw_gifts_cards\GiftCardConfigEntityInterface $revision */
      $revision = $gift_card_config_storage->loadRevision($vid);
      // Only show revisions that are affected by the language that is being
      // displayed.
      if ($revision->hasTranslation($langcode) && $revision->getTranslation($langcode)->isRevisionTranslationAffected()) {
        $username = [
          '#theme' => 'username',
          '#account' => $revision->getRevisionUser(),
        ];

        // Use revision link to link to revisions that are not active.
        $date = \Drupal::service('date.formatter')->format($revision->revision_timestamp->value, 'short');
        if ($vid != $gift_card_config->getRevisionId()) {
          $link = $this->l($date, new Url('entity.gift_card_config.revision', ['gift_card_config' => $gift_card_config->id(), 'gift_card_config_revision' => $vid]));
        }
        else {
          $link = $gift_card_config->link($date);
        }

        $row = [];
        $column = [
          'data' => [
            '#type' => 'inline_template',
            '#template' => '{% trans %}{{ date }} by {{ username }}{% endtrans %}{% if message %}<p class="revision-log">{{ message }}</p>{% endif %}',
            '#context' => [
              'date' => $link,
              'username' => \Drupal::service('renderer')->renderPlain($username),
              'message' => ['#markup' => $revision->revision_log_message->value, '#allowed_tags' => Xss::getHtmlTagList()],
            ],
          ],
        ];
        $row[] = $column;

        if ($latest_revision) {
          $row[] = [
            'data' => [
              '#prefix' => '<em>',
              '#markup' => $this->t('Current revision'),
              '#suffix' => '</em>',
            ],
          ];
          foreach ($row as &$current) {
            $current['class'] = ['revision-current'];
          }
          $latest_revision = FALSE;
        }
        else {
          $links = [];
          if ($revert_permission) {
            $links['revert'] = [
              'title' => $this->t('Revert'),
              'url' => Url::fromRoute('entity.gift_card_config.revision_revert', ['gift_card_config' => $gift_card_config->id(), 'gift_card_config_revision' => $vid]),
            ];
          }

          if ($delete_permission) {
            $links['delete'] = [
              'title' => $this->t('Delete'),
              'url' => Url::fromRoute('entity.gift_card_config.revision_delete', ['gift_card_config' => $gift_card_config->id(), 'gift_card_config_revision' => $vid]),
            ];
          }

          $row[] = [
            'data' => [
              '#type' => 'operations',
              '#links' => $links,
            ],
          ];
        }

        $rows[] = $row;
      }
    }

    $build['gift_card_config_revisions_table'] = array(
      '#theme' => 'table',
      '#rows' => $rows,
      '#header' => $header,
    );

    return $build;
  }

}
