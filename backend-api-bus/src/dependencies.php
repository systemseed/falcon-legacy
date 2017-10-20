<?php
// DIC configuration.
$container = $app->getContainer();

// Monolog logger.
$container['logger'] = function (\Slim\Container $container) {
  $settings = $container->get('settings')['logger'];
  $logger = new Monolog\Logger($settings['name']);
  $logger->pushProcessor(new Monolog\Processor\UidProcessor());
  $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['path'], $settings['level']));
  return $logger;
};
