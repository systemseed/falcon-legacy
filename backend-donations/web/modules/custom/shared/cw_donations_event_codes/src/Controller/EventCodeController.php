<?php

namespace Drupal\cw_donations_event_codes\Controller;

use Drupal\Component\Utility\Xss;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Url;
use Drupal\cw_donations_event_codes\Entity\EventCodeInterface;

/**
 * Class EventCodeController.
 *
 *  Returns responses for Event code routes.
 *
 * @package Drupal\cw_donations_event_codes\Controller
 */
class EventCodeController extends ControllerBase implements ContainerInjectionInterface {

  /**
   * Displays a Event code  revision.
   *
   * @param int $event_code_revision
   *   The Event code  revision ID.
   *
   * @return array
   *   An array suitable for drupal_render().
   */
  public function revisionShow($event_code_revision) {
    $event_code = $this->entityManager()->getStorage('event_code')->loadRevision($event_code_revision);
    $view_builder = $this->entityManager()->getViewBuilder('event_code');

    return $view_builder->view($event_code);
  }

  /**
   * Page title callback for a Event code  revision.
   *
   * @param int $event_code_revision
   *   The Event code  revision ID.
   *
   * @return string
   *   The page title.
   */
  public function revisionPageTitle($event_code_revision) {
    $event_code = $this->entityManager()->getStorage('event_code')->loadRevision($event_code_revision);
    return $this->t('Revision of %title from %date', array('%title' => $event_code->label(), '%date' => format_date($event_code->getRevisionCreationTime())));
  }

  /**
   * Generates an overview table of older revisions of a Event code .
   *
   * @param \Drupal\cw_donations_event_codes\Entity\EventCodeInterface $event_code
   *   A Event code  object.
   *
   * @return array
   *   An array as expected by drupal_render().
   */
  public function revisionOverview(EventCodeInterface $event_code) {
    $account = $this->currentUser();
    $langcode = $event_code->language()->getId();
    $langname = $event_code->language()->getName();
    $languages = $event_code->getTranslationLanguages();
    $has_translations = (count($languages) > 1);
    $event_code_storage = $this->entityManager()->getStorage('event_code');

    $build['#title'] = $has_translations ? $this->t('@langname revisions for %title', ['@langname' => $langname, '%title' => $event_code->label()]) : $this->t('Revisions for %title', ['%title' => $event_code->label()]);
    $header = array($this->t('Revision'), $this->t('Operations'));

    $revert_permission = (($account->hasPermission("revert all event code revisions") || $account->hasPermission('administer event code entities')));
    $delete_permission = (($account->hasPermission("delete all event code revisions") || $account->hasPermission('administer event code entities')));

    $rows = array();

    $vids = $event_code_storage->revisionIds($event_code);

    $latest_revision = TRUE;

    foreach (array_reverse($vids) as $vid) {
      /** @var \Drupal\cw_donations_event_codes\EventCodeInterface $revision */
      $revision = $event_code_storage->loadRevision($vid);
      // Only show revisions that are affected by the language that is being
      // displayed.
      if ($revision->hasTranslation($langcode) && $revision->getTranslation($langcode)->isRevisionTranslationAffected()) {
        $username = [
          '#theme' => 'username',
          '#account' => $revision->getRevisionUser(),
        ];

        // Use revision link to link to revisions that are not active.
        $date = \Drupal::service('date.formatter')->format($revision->revision_timestamp->value, 'short');
        if ($vid != $event_code->getRevisionId()) {
          $link = $this->l($date, new Url('entity.event_code.revision', ['event_code' => $event_code->id(), 'event_code_revision' => $vid]));
        }
        else {
          $link = $event_code->link($date);
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
              'url' => Url::fromRoute('entity.event_code.revision_revert', ['event_code' => $event_code->id(), 'event_code_revision' => $vid]),
            ];
          }

          if ($delete_permission) {
            $links['delete'] = [
              'title' => $this->t('Delete'),
              'url' => Url::fromRoute('entity.event_code.revision_delete', ['event_code' => $event_code->id(), 'event_code_revision' => $vid]),
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

    $build['event_code_revisions_table'] = array(
      '#theme' => 'table',
      '#rows' => $rows,
      '#header' => $header,
    );

    return $build;
  }

}
