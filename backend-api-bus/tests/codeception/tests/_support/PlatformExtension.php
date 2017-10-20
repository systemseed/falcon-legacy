<?php

class PlatformExtension extends \Codeception\Extension
{

  public static $events = array(
    'test.before' => 'beforeTest',
  );

  public function beforeTest(\Codeception\Event\TestEvent $event) {

    // Get URL from CircleCI environment.
    // See circle.yml file to find how this var gets generated.
    $api_bus_url = getenv('ABI_BUS_URL');


    if (!empty($api_bus_url)) {

      // Add HTTP auth to the URL.
      $url = $api_bus_url;

      // Remove the final slash from the URL.
      $url = substr($url, 0, -1);

      if ($this->hasModule('REST')) {
        $this->getModule('REST')->_reconfigure(array('url' => $url));
      }

      if ($this->hasModule('PhpBrowser')) {
        $this->getModule('PhpBrowser')->_reconfigure(array('url' => $url));
      }

    }

  }

}
