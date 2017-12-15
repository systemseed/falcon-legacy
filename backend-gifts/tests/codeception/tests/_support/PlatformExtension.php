<?php

class PlatformExtension extends \Codeception\Extension
{

  public static $events = array(
    'test.before' => 'beforeTest',
  );

  public function beforeTest(\Codeception\Event\TestEvent $event) {

    codecept_debug('\PlatformExtension::beforeTest started...');
    codecept_debug(getenv('BACKEND_GIFTS_URL'));
    codecept_debug(getenv('BACKEND_DONATIONS_URL'));
    codecept_debug(getenv('FRONTEND_GIFTS_URL'));

    // Get URL from CircleCI environment.
    // See circle.yml file to find how this var gets generated.
    $platform_url = getenv('BACKEND_GIFTS_URL');

    // Get current test groups.
    $test_groups = $event->getTest()->getMetadata()->getGroups();

    // For tests in frontend-gifts group set frontend URL.
    if (in_array('frontend-gifts', $test_groups)) {
      $platform_url = getenv('FRONTEND_GIFTS_URL');
    }

    // For tests in backend-donations group set donations URL.
    if (in_array('backend-donations', $test_groups)) {
      $platform_url = getenv('BACKEND_DONATIONS_URL');
    }

    if (!empty($platform_url)) {

      // Add HTTP auth to the URL.
      $parsed_url = parse_url($platform_url);
      $url = $parsed_url['scheme'] . '://' . $this->config['http_user'] . ':' . $this->config['http_pass'] . '@' . $parsed_url['host'] . $parsed_url['path'];

      // Remove the final slash from the URL.
      $url = substr($url, 0, -1);

      if ($this->hasModule('WebDriver')) {
        $this->getModule('WebDriver')->_reconfigure(array('url' => $url));
      }

      if ($this->hasModule('REST')) {
        $this->getModule('REST')->_reconfigure(array('url' => $url));
      }

      if ($this->hasModule('PhpBrowser')) {
        $this->getModule('PhpBrowser')->_reconfigure(array('url' => $url));
      }

    }

  }

}
