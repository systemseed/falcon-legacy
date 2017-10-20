<?php

/**
 * Class CustomUrlsExtension
 *
 */
class CustomUrlsExtension extends \Codeception\Extension {
  public static $events = array(
    'test.before' => 'beforeTest',
  );

  public function beforeTest(\Codeception\Event\TestEvent $event) {
    $this->setFrontendUrl($event);
    $this->setDonationsUrl($event);
  }

  public function setFrontendUrl(\Codeception\Event\TestEvent $event) {
    // Only for WebDriver.
    if (!$this->hasModule('WebDriver')) {
      return;
    }

    // Only if frontend_url config is set.
    if (empty($this->getGlobalConfig()['modules']['config']['WebDriver']['frontend_url'])) {
      return;
    }

    $frontend_url = $this->getGlobalConfig()['modules']['config']['WebDriver']['frontend_url'];

    // Only if current test in frontend-gifts group.
    if (!in_array('frontend-gifts', $event->getTest()->getMetadata()->getGroups())) {
      return;
    }

    // Set frontend url.
    $this->getModule('WebDriver')->_reconfigure(array('url' => $frontend_url));
  }

  public function setDonationsUrl(\Codeception\Event\TestEvent $event) {
    // Only for WebDriver.
    if (!$this->hasModule('WebDriver')) {
      return;
    }

    // Only if frontend_url config is set.
    if (empty($this->getGlobalConfig()['modules']['config']['WebDriver']['donations_url'])) {
      return;
    }

    $url = $this->getGlobalConfig()['modules']['config']['WebDriver']['donations_url'];

    // Only if current test in frontend-gifts group.
    if (!in_array('backend-donations', $event->getTest()->getMetadata()->getGroups())) {
      return;
    }

    // Set frontend url.
    $this->getModule('WebDriver')->_reconfigure(array('url' => $url));
  }
}
