<?php

class PlatformExtension extends \Codeception\Extension
{

  public static $events = array(
    'test.before' => 'beforeTest',
  );

  public function beforeTest(\Codeception\Event\TestEvent $event) {

    // Get URL from CircleCI environment.
    // See circle.yml file to find how this var gets generated.
    $donations_url = getenv('DONATIONS_URL');

    if (!empty($donations_url)) {

      // Add HTTP auth to the URL.
      $parsed_url = parse_url($donations_url);
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
