<?php
/**
 * @file
 * Platform.sh example settings.php file for Drupal 8.
 */
// Default Drupal 8 settings.
//
// These are already explained with detailed comments in Drupal's
// default.settings.php file.
//
// See https://api.drupal.org/api/drupal/sites!default!default.settings.php/8
$databases = [];
$config_directories = [];
$settings['update_free_access'] = FALSE;
$settings['container_yamls'][] = $app_root . '/' . $site_path . '/services.yml';
$settings['file_scan_ignore_directories'] = [
  'node_modules',
  'bower_components',
];
// Install with the 'standard' profile for this example.
//
// As the settings.php file is not writable during install on Platform.sh (for
// good reasons), Drupal will refuse to install a profile that is not defined
// here.
$settings['install_profile'] = 'standard';
// The hash_salt should be a unique random value for each application.
// If left unset, the settings.platformsh.php file will attempt to provide one.
// You can also provide a specific value here if you prefer and it will be used
// instead. In most cases it's best to leave this blank on Platform.sh. You
// can configure a separate hash_salt in your settings.local.php file for
// local development.
// $settings['hash_salt'] = 'change_me';
// Set up a config sync directory.
//

// Auth settings on local env. See full path to certificates in your system.
$config['simple_oauth.settings']['public_key'] = DRUPAL_ROOT . '/../certificates/public.key';
$config['simple_oauth.settings']['private_key'] = DRUPAL_ROOT . '/../certificates/private.key';

// Set Platform routes in Drupal config variables.
if (!empty($_ENV['PLATFORM_ROUTES'])) {

  // Need to decode the platform routes.
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

// Use files from UK configuration folder for UK site.
$config['config_split.config_split.ie']['status'] = TRUE;
$config['config_split.config_split.gb']['status'] = FALSE;
if (getenv('CW_REGION') == 'gb') {
  $config['config_split.config_split.ie']['status'] = FALSE;
  $config['config_split.config_split.gb']['status'] = TRUE;
}

// Automatic Platform.sh settings.
if (file_exists($app_root . '/' . $site_path . '/settings.platformsh.php')) {
  include $app_root . '/' . $site_path . '/settings.platformsh.php';
}
// Local settings. These come last so that they can override anything.
if (file_exists($app_root . '/' . $site_path . '/settings.local.php')) {
  include $app_root . '/' . $site_path . '/settings.local.php';
}
