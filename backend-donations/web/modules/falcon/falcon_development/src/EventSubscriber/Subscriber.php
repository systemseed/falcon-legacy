<?php

namespace Drupal\falcon_development\EventSubscriber;

use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Event subscriber for logging of API bus requests.
 *
 * NOTE: cached requests are not logged.
 */
class Subscriber implements EventSubscriberInterface {

  /**
   * Logger channel.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  protected $log;

  /**
   * RequestSubscriber constructor.
   *
   * @param \Drupal\Core\Logger\LoggerChannelFactoryInterface $logger_factory
   */
  public function __construct(LoggerChannelFactoryInterface $logger_factory) {
    $this->log = $logger_factory->get('falcon_development');
  }

  /**
   * Log API bus requests.
   *
   * @param \Symfony\Component\HttpKernel\Event\FilterResponseEvent $event
   *   The event to process.
   */
  public function onResponse(FilterResponseEvent $event) {
    try {
      $headers = $event->getRequest()->headers->all();
      if (empty($headers['user-agent']) || $headers['user-agent'][0] != 'Api-Bus') {
        return;
      }

      $this->log->debug('@method @uri; Headers: <pre>@headers</pre>; Server: <pre>@server</pre>', [
        '@method' => $event->getRequest()->getMethod(),
        '@uri' => $event->getRequest()->getRequestUri() . $event->getRequest()->getQueryString(),
        '@headers' => print_r($headers, TRUE),
        '@server' => print_r($_SERVER, TRUE),
      ]);
    }
    catch (\Exception $e) {
      // Do not break the site if logging fails.
    }
  }

  /**
   * Implements \Symfony\Component\EventDispatcher\EventSubscriberInterface::getSubscribedEvents().
   */
  public static function getSubscribedEvents() {
    $events[KernelEvents::RESPONSE][] = ['onResponse'];
    return $events;
  }

}
