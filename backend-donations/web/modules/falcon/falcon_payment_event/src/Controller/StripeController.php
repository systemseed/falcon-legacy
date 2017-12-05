<?php

namespace Drupal\falcon_payment_event\Controller;

use Drupal\Core\Controller\ControllerBase;
use Zend\Diactoros\Response\EmptyResponse;
use GuzzleHttp\Cookie\FileCookieJar;

/**
 * Class StripeController.
 *
 * @package Drupal\falcon_payment_event\Controller
 */
class StripeController extends ControllerBase {

  protected $sendEmailActions = [
    'manage.bank_account.created', 'manage.bank_account.updated', 'manage.bank_account.deleted'
  ];

  /**
   * Creates Payment event entities from Stripe Security History report.
   */
  function createPaymentEventEntities() {
    try {
      $siteMode = \Drupal::config('cw_core.settings')->get('test_mode_enabled') ? 'test' : 'live';
      $paymentGateway = 'gifts_' . $siteMode . '_stripe';

      // Returns an error if Stripe developer user isn't defined in Payment gateway configuration.
      $stripe_username = \Drupal::config('falcon_payment_event.' . $paymentGateway)->get('developer_username');
      if (empty($stripe_username)) {
        return new EmptyResponse(500);
      }

      // Gets activity items from Stripe.
      $activities = $this->getAccountActivities($paymentGateway);
      if (!empty($activities)) {
        $this->createEntities($paymentGateway, $activities);
      }

      return new EmptyResponse(200);
    }
    catch (\Exception $e) {
      watchdog_exception('falcon_payment_event', $e);
      return new EmptyResponse(500);
    }
  }

  /**
   * Gets Account activities from Stripe account.
   *
   * @param string $paymentGateway
   *   Payment gateway machine name.
   * @param bool $allow_retry
   *   Retry on failure if auth token has expired.
   *
   * @return array of Stripe activities.
   * @throws \Exception
   */
  function getAccountActivities($paymentGateway, $allow_retry = TRUE) {
    if (empty($paymentGateway)) {
      throw new \Exception('Payment gateway name cannot be empty.');
    }

    // Prepares file for cookie. We use it to skip 'Logged in from a new device' messages in Stripe.
    $cookieFilePath = "private://stripe/$paymentGateway.cookie_jar.txt";
    $cookieJar = new FileCookieJar($cookieFilePath, TRUE);

    // NOTE: we reuse the same cookie file where possible (to avoid
    // "Logged in from a new device" security event on every request) but we
    // request a new CSRF-token because caching of that token didn't really
    // work in the long term.
    try {
      // Makes first request to get csrf_token from response HTML.
      $anonCsrfToken = $this->getStripeCsrfTokenForLogin($cookieJar);
      // Login to Stripe dashboard with credentials.
      $responseData = $this->loginToStripe($cookieJar, $anonCsrfToken, $paymentGateway);
      // Gets csrf token from logged in user.
      $data = \GuzzleHttp\json_decode($responseData);
    }
    catch (\Exception $e) {
      // Try to generate and use a new cookie file in case of any issues.
      // Generates "Logged in from a new device" event in the security log.
      file_unmanaged_delete($cookieFilePath);

      $cookieJar = new FileCookieJar($cookieFilePath, TRUE);
      // Makes first request to get csrf_token from response HTML.
      $anonCsrfToken = $this->getStripeCsrfTokenForLogin($cookieJar);
      // Login to Stripe dashboard with credentials.
      $responseData = $this->loginToStripe($cookieJar, $anonCsrfToken, $paymentGateway);
      // Gets csrf token from logged in user.
      $data = \GuzzleHttp\json_decode($responseData);
    }

    if (empty($data->csrf_token)) {
      throw new \Exception('There is a problem with stripe request.');
    }

    $httpClient = \Drupal::service('http_client_factory')->fromOptions([
      'headers' => [
        'User-Agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 Safari/537.36',
        'Accept' => 'application/json',
        'x-stripe-csrf-token' => $data->csrf_token,
      ],
      'timeout' => 60,
      'cookies' => $cookieJar,
    ]);

    // Get list of account activities.
    $response = $httpClient->get('https://dashboard.stripe.com/ajax/account_activities');
    $responseData = (string) $response->getBody();
    if (empty($responseData)) {
      throw new \Exception('There is a problem with stripe request.');
    }

    $data = \GuzzleHttp\json_decode($responseData);

    if (empty($data->activities)) {
      throw new \Exception('Activities key is not found in Stripe response.');
    }

    // Sort activities to keep latest on the top.
    $activities = $data->activities;
    usort($activities, function($a, $b) {
      return strcmp($b->created, $a->created);
    });

    return $activities;
  }

  /**
   * Makes first request to get csrf_token from response HTML.
   */
  private function getStripeCsrfTokenForLogin(&$cookieJar) {

    $httpClient = \Drupal::service('http_client_factory')->fromOptions([
      'headers' => [
        'User-Agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 Safari/537.36',
      ],
      'timeout' => 60,
      'cookies' => $cookieJar
    ]);

    $response = $httpClient->get('https://dashboard.stripe.com/login');

    $data = (string) $response->getBody();
    if (empty($data)) {
      throw new \Exception('There is a problem with stripe request.');
    }

    // Parse and look for preloaded_json, it contains generated csrf_token.
    $doc = new \DOMDocument();
    $doc->loadHTML($data);
    $preloaded_json_html = $doc->getElementById('preloaded_json');

    // Get csrf_token from response HTML.
    $preloaded_json_data = htmlspecialchars_decode($preloaded_json_html->textContent);
    $preloaded_json = \GuzzleHttp\json_decode($preloaded_json_data);
    return $preloaded_json->csrf_token;
  }

  /**
   * Login to Stripe dashboard with credentials.
   */
  private function loginToStripe($cookieJar, $csrfToken, $paymentGateway) {
    // Gets Stripe creds from configuration. Creds can be saved in settings.php or in config files separated by region.
    $config = \Drupal::config('falcon_payment_event.' . $paymentGateway);
    $stripe_username = $config->get('developer_username');
    $stripe_password = $config->get('developer_password');

    $httpClient = \Drupal::service('http_client_factory')->fromOptions([
      'headers' => [
        'User-Agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 Safari/537.36',
        'Accept' => 'application/json',
        'x-stripe-csrf-token' => $csrfToken,
      ],
      'timeout' => 60,
      'cookies' => $cookieJar,
      'form_params' => ['email' => $stripe_username, 'password' => $stripe_password]
    ]);

    // Makes request for login.
    $response = $httpClient->post('https://dashboard.stripe.com/ajax/sessions');
    return (string) $response->getBody();
  }

  /**
   * Utility to fix broken Stripe cookie / token and start from scratch.
   * IMPORTANT: it will generate "Logged in from a new device" event in the
   * security log on next API call.
   */
  public function resetStripeAuthentication() {
    $siteMode = \Drupal::config('cw_core.settings')->get('test_mode_enabled') ? 'test' : 'live';
    $paymentGateway = 'gifts_' . $siteMode . '_stripe';

    $cookieFilePath = "private://stripe/$paymentGateway.cookie_jar.txt";
    file_unmanaged_delete($cookieFilePath);

    \Drupal::state()->set("x-stripe-csrf-token.$paymentGateway", NULL);
  }

  /**
   * Creates payment event entities from Stripe activities items.
   */
  function createEntities($paymentGateway, $activities) {
    // Gets last added payment event entity.
    $query = \Drupal::database()->select('payment_event_field_data', 'pfd');
    $query->join('payment_event__field_stripe_event_payment_gw', 'pegw', 'pegw.entity_id = pfd.id');
    $query->addField('pfd', 'created');
    $query->orderBy('created', 'DESC');
    $query->condition('pfd.type', 'stripe_event');
    $query->condition('pegw.field_stripe_event_payment_gw_target_id', $paymentGateway);
    $query->range(0, 1);
    $lastCreated = $query->execute()->fetchField();

    $created_events = [];
    $entity_type_mgr = \Drupal::getContainer()->get('entity_type.manager');
    foreach ($activities as $activity) {
      // Create payment event entity only for not existing activities.
      if (intval($activity->created) == $lastCreated) {
        break;
      }
      // Send emails to stored in config emails if Stripe banking account has been changed.
      if (in_array($activity->action, $this->sendEmailActions)) {
        // Do not send email notification for events older than 8 hours.
        // This check is useful for initial import of history events.
        if ($activity->created > (REQUEST_TIME - 60 * 60 * 8)) {
          $this->sendEmail($paymentGateway, $activity);
        }
      }

      // Creates an entity from activity information.
      $entity = $entity_type_mgr->getStorage('payment_event')->create([
          'type' => 'stripe_event',
          'field_stripe_event_email' => $activity->user_email,
          'field_stripe_event_action' => $activity->action,
          'field_stripe_event_description' => $this->normalizeDescription($activity),
          'created' => intval($activity->created),
          'field_stripe_event_payment_gw' => $paymentGateway,
          'field_stripe_event_metadata' => \GuzzleHttp\json_encode($activity),
        ]
      );
      $entity->save();
      $created_events[] = $activity->action;
    }

    if (count($created_events)) {
      $message = 'Payment event cron run completed, @amount items were created.';
      \Drupal::logger('falcon_payment_event')
        ->notice($message, ['@amount' => count($created_events)]);
    }
  }

  /**
   * Prepares human readable description.
   *
   * Mapping is based on functionality from Stripe js script: https://b.stripecdn.com/manage/assets/dashboard.1c6c6a47a5158907a722ee73c6a7f47d.min.js.
   * Can be catched from Chrome Sources pane.
   */
  function normalizeDescription($activity) {
    switch ($activity->action) {
      case 'manage.password_reset.request.sent':
        $output = t('Requested a password reset email');
        break;
      case 'manage.password_reset.failed':
        $output = t('Password reset failed');
        break;
      case 'manage.password_reset.succeeded':
        $output = t('Successfully reset password');
        break;
      case 'manage.user.password_changed':
        $output = t('Changed password');
        break;
      case 'manage.confirm_email.successfully_changed':
        $output = t('Changed email address'); // Can be improved to include full information.
        break;
      case 'manage.login.succeeded':
      case 'manage.login.google_sso.succeeded':
        $output = t('Logged in from a new device');
        break;
      case 'manage.login.rate_limited':
        $output = t('Login was temporary disabled (Too many failed login attempts)');
        break;
      case 'manage.login.failed.invalid_password':
        $output = t('Entered wrong password (When attempting to log in)');
        break;
      case 'manage.login.failed.bad_otp':
        $output = t('Failed 2-factor authentication (When attempting to log in)');
        break;
      case 'manage.merchant_key.rolled':
        $output = t('Rolled API key'); // Can be improved to include full information.
        break;
      case 'manage.merchant_key.viewed':
        $output = t('Viewed API keys from a new device');
        break;
      case 'manage.merchant.api_version_updated':
        $output = t('Updated your account\'s API version'); // Can be improved to include full information.
        break;
      case 'manage.bank_account.created':
        $output = t('Added a bank account'); // Can be improved to include full information.
        break;
      case 'manage.bank_account.updated':
        $output = t('Changed bank account settings'); // Can be improved to include full information.
        break;
      case 'manage.bank_account.deleted':
        $output = t('Deleted a bank account'); // Can be improved to include full information.
        break;
      case 'manage.payout_application.created':
        $output = t('Disabled automatic payouts');
        break;
      case 'manage.payout_application.deleted':
        $output = t('Enabled automatic payouts'); // Can be improved to include full information.
        break;
      case 'manage.payout_plan.changed':
        $output = t('Changed your payout schedule');
        break;
      case 'manage.merchant.statement_descriptor_updated':
        $output = t('Changed your account\'s statement descriptor'); // Can be improved to include full information.
        if (!empty($activity->new_value) && !empty($activity->new_value->statement_descriptor)) {
          $output .= ' to ' . $activity->new_value->statement_descriptor;
        }

        break;
      case 'manage.settings.contact_information_changed':
        $output = t('Changed your account\'s contact information');
        break;
      case 'manage.settings.business_logo_changed':
        $output = t('Changed your account\'s business logo');
        break;
      case 'manage.settings.public_information_changed':
        $output = t('Changed your account\'s public information');
        break;
      case 'manage.settings.timezone_changed':
        $output = t('Changed your account\'s timezone'); // Can be improved to include full information.
        break;
      case 'manage.merchant.nickname_changed':
        $output = t('Changed your account\'s display name'); // Can be improved to include full information.
        break;
      case 'manage.settings.cvc_verification_changed':
        $output = t('Enabled or Disabled CVC verification for charges'); // Can be improved to include full information.
        break;
      case 'manage.settings.zip_verification_changed':
        $output = t('Enabled or Disabled zip code verification for charges'); // Can be improved to include full information.
        break;
      case 'manage.user.invited':
        $output = t('Invited a new team member'); // Can be improved to include full information.
        break;
      case 'manage.team_invite.joined':
        $output = t('Joined your team');
        break;
      case 'manage.user.permissions_updated':
        $output = t('Changed a user\'s permissions'); // Can be improved to include full information.
        break;
      case 'manage.user.access_revoked':
        $output = t('Removed a team member'); // Can be improved to include full information.
        break;
      case 'manage.role.created':
        $output = t('Created a new role'); // Can be improved to include full information.
        break;
      case 'manage.role.modified':
        $output = t('Modified a role'); // Can be improved to include full information.
        break;
      case 'manage.role.deleted':
        $output = t('Deleted a role (Role: ');
        break;
      case 'manage.merchant.owner_changed':
        $output = t('Changed your account\'s owner'); // Can be improved to include full information.
        break;
      case 'manage.webhook.created':
        $output = t('Added a webhook endpoint'); // Can be improved to include full information.
        break;
      case 'manage.webhook.updated':
        $output = t('Changed a webhook endpoint'); // Can be improved to include full information.
        break;
      case 'manage.webhook.deleted':
        $output = t('Deleted a webhook endpoint'); // Can be improved to include full information.
        break;
      case 'manage.emails.receipt_changed':
        $output = t('Enabled or Disabled receipt emails'); // Can be improved to include full information.
        break;
      case 'manage.emails.payment_emails_changed':
        $output = t('Enabled or Disabled payment confirmation emails'); // Can be improved to include full information.
        break;
      case 'manage.otp.enabled':
      case 'manage.2fa.phone.enabled':
      case 'manage.phone_2fa.enabled':
        $output = t('Enabled 2-factor authentication'); // Can be improved to include full information.
        break;
      case 'manage.otp.emergency.disabled':
      case 'manage.2fa.backup.disabled':
        $output = t('Disabled 2-factor authentication (Using an emergency code)');
        break;
      case 'manage.otp.disabled':
      case 'manage.2fa.phone.disabled':
      case 'manage.phone_2fa.disabled':
        $output = t('Disabled 2-factor authentication'); // Can be improved to include full information.
        break;
      case 'manage.otp.emergency.failed.bad_code':
        $output = t('Failed to disable 2-factor authentication (Incorrect emergency code)');
        break;
      case 'manage.merchant.subscription_retry_settings_updated':
        $output = t('Changed subscription retry behavior');
        break;
      case 'manage.merchant.subscription_dunning_settings_updated':
        $output = t('Changed subscription dunning behavior');
        break;
      case 'manage.client_application.created':
        $output = t('Created a connect application');
        break;
      case 'manage.client_application.updated':
        $output = t('Changed your connect application\'s settings'); // Can be improved to include full information.
        break;
      case 'manage.oauth.connection.deleted':
        $output = t('Removed a connect application'); // Can be improved to include full information.
        break;
      case 'manage.oauth.connection.created':
        $output = t('Added a connect application'); // Can be improved to include full information.
        break;
      case 'manage.data_export.requested':
        $output = t('Exported account data');
        break;
      case 'manage.merchant.test_data_deleted':
        $output = t('Deleted test account data');
        break;
      default:
        return $activity->action;
    }

    return $output;
  }

  /**
   * Send email to stored in config emails if Stripe banking account has been changed.
   */
  function sendEmail($paymentGateway, $activity) {
    $to = \Drupal::config('falcon_payment_event.' . $paymentGateway)->get('account_updates_notification_emails');
    if (empty($to)) {
      return;
    }
    // Prepares Email's subject and body.
    $params['subject'] = t('IMPORTANT! Stripe activity: @event', ['@event' => $this->normalizeDescription($activity)]);
    $params['body'] = t("Your Stripe banking account data has been changed. See more information in <a href='@url'>Security History</a> report.",
      ['@url' => 'https://dashboard.stripe.com/security_history']);
    $langcode = \Drupal::languageManager()->getDefaultLanguage();

    // Send email with drupal_mail.
    $message =  \Drupal::service('plugin.manager.mail')->mail('falcon_payment_event', 'stripe_account_changed', $to, $langcode, $params);

    // Add message to the log if email has been sent.
    if (!empty($message['result'])) {
      \Drupal::logger('falcon_payment_event')->notice('Stripe notification has been successfully sent.');
    }
    else {
      \Drupal::logger('falcon_payment_event')->notice('There was a problem sending Stipe notification message.');
    }
  }
}
