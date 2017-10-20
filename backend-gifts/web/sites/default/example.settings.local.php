<?php
/**
 * @file
 * An example settings.local.php file for Drupal. SystemSeed updated version.
 */

assert_options(ASSERT_ACTIVE, TRUE);
\Drupal\Component\Assertion\Handle::register();

// Local hash salt.
$settings['hash_salt'] = 'random_local_salt';

// Enable local development services.
$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/development.services.yml';

// Error logging.
$config['system.logging']['error_level'] = 'verbose';

// Disable CSS and JS aggregation.
$config['system.performance']['css']['preprocess'] = FALSE;
$config['system.performance']['js']['preprocess'] = FALSE;

// Set private files folder.
$settings['file_private_path'] = preg_replace('~/web$~', '/private', $app_root);

// TODO: set up correct Docker local urls.
$config['routes'] = [
  'backend-api-bus' => ['url' => 'http://api.flc.local/'],
  'backend-donations' => ['url' => 'http://donations.api.flc.local/'],
  'frontend-gifts' => ['url' => 'http://gifts.flc.local/'],
];

// API credentials for machine-to-machine communication between backends.
// @todo add oauth credentials see: /admin/config/people/simple_oauth/oauth2_client
$config['routes']['backend-donations']['client_id'] = '';
$config['routes']['backend-donations']['client_secret'] = '';

// Add your database configuration here.
$databases['default']['default'] = array(
  'driver' => 'mysql',
  'host' => 'be_gifts_mariadb',
  'username' => 'drupal',
  'password' => 'drupal',
  'database' => 'drupal',
  'prefix' => '',
);

// Will use UK configuration files if TRUE.
$config['config_split.config_split.ie']['status'] = TRUE;
$config['config_split.config_split.gb']['status'] = FALSE;