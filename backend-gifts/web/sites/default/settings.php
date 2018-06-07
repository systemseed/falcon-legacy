<?php

// See https://api.drupal.org/api/drupal/sites!default!default.settings.php/8
$databases = [];
$config_directories = [];
$settings['update_free_access'] = FALSE;
$settings['container_yamls'][] = __DIR__ . '/services.yml';
$settings['file_scan_ignore_directories'] = [
  'node_modules',
  'bower_components',
];

// Install with the 'standard' profile for this example.
//
// As the settings.php file is not writable during install on Platform.sh (for
// good reasons), Drupal will refuse to install a profile that is not defined
// here.
$settings['install_profile'] = 'config_installer';

// Auth settings on local env. See full path to certificates in your system.
$config['simple_oauth.settings']['public_key'] = DRUPAL_ROOT . '/../certificates/public.key';
$config['simple_oauth.settings']['private_key'] = DRUPAL_ROOT . '/../certificates/private.key';

// Set Platform routes in Drupal config variables.
if (!empty($_ENV['PLATFORM_ROUTES'])) {
  $platform_routes = json_decode(base64_decode($_ENV['PLATFORM_ROUTES']), TRUE);
  foreach ($platform_routes as $url => $route) {
    $proto = substr($route['original_url'], 0, 6);
    if (!empty($route['upstream']) && $proto === 'https:') {
      $config['routes'][$route['upstream']]['url'] = $url;
    }
  }
}

// API credentials for machine-to-machine communication between backends.
// @todo add oauth credentials see: /admin/config/people/simple_oauth/oauth2_client
$config['routes']['backend-donations']['client_id'] = '';
$config['routes']['backend-donations']['client_secret'] = '';

// This is defined inside the read-only "config" directory, deployed via Git.
$config_directories[CONFIG_SYNC_DIRECTORY] = '../config/sync';

// Enable reverse proxy to pass IP addresses from API Bus and CDN.
$settings['reverse_proxy'] = TRUE;
$settings['reverse_proxy_addresses'] = [$_SERVER['REMOTE_ADDR']];

// Custom configs for sites based on Falcon. This folder is always empty
// for Falcon repo. However, if you're basing your site on top of Falcon and
// there are configs different from Falcon's, then you'll want to graylist
// them and they'll appear on config export in separate folder automatically.
$config['config_split.config_split.customizations']['status'] = TRUE;
$config['config_split.config_split.development']['status'] = TRUE;

/**
 * Settings for Platform.sh environments.
 */
if (!empty($_ENV['PLATFORM_BRANCH'])) {
  // Include Platform.sh specific configs to connect
  // Drupal to Platform.sh servers.
  require_once(__DIR__ . '/settings.platformsh.php');

  if ($_ENV['PLATFORM_BRANCH'] == 'master') {
    // Include production-only configs which override
    // development settings.
    require_once(__DIR__ . '/settings.env_production.php');
  }
}
// Local settings. These come last so that they can override anything.
else {
  require_once(__DIR__ . '/settings.local.php');
}

