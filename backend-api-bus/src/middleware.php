<?php
// Application middleware

use Middleware\PlatformConfigMiddleware;

// Add Platform.sh configuration middleware.
$app->add(new PlatformConfigMiddleware($app));

// Get CORs origin from Platfrom.
$cors_origin = PlatformConfigMiddleware::getOrigin();

// Fallback to configs.
if (empty($cors_origin)) {
  $cors_origin = $app->getContainer()->get('settings')->get('cors_origin');
}

$app->add(new \Tuupola\Middleware\Cors([
  "origin" => $cors_origin,
  "methods" => ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  "headers.allow" => ["Authorization", "If-Match", "If-Unmodified-Since", "X-Requested-With", "Content-Type", "Accept", "Origin"],
  "headers.expose" => ["*"],
  "credentials" => TRUE,
  "cache" => 0,
]));
