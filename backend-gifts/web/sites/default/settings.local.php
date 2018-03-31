<?php
/**
 * @file
 * An example settings.local.php file for Drupal. SystemSeed updated version.
 */

assert_options(ASSERT_ACTIVE, TRUE);
\Drupal\Component\Assertion\Handle::register();

# Display all errors.
$config['system.logging']['error_level'] = 'verbose';

// Enable local development services.
$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/development.services.yml';

// Set private files folder.
$settings['file_private_path'] = preg_replace('~/web$~', '/private', $app_root);

// TODO: set up correct Docker local urls.
$config['routes'] = [
  'backend-api-bus' => ['url' => 'http://api_bus/'],
  'backend-donations' => ['url' => 'http://donations.api.flc.local/'],
  'frontend-gifts' => ['url' => 'http://gifts.flc.local/'],
];

// Configure base url for images going outside of the site.
$config['rest_absolute_urls']['base_url'] = 'http://gifts.api.flc.local';
$settings['file_public_base_url'] = 'http://gifts.api.flc.local/sites/default/files';

// API credentials for machine-to-machine communication between backends.
// @todo add oauth credentials see: /admin/config/people/simple_oauth/oauth2_client
$config['routes']['backend-donations']['client_id'] = '';
$config['routes']['backend-donations']['client_secret'] = '';

// Make default hash salt for local envs.
$settings['hash_salt'] = 'insecure-local-hash';

$databases['default']['default'] = array (
  'database' => 'drupal',
  'username' => 'drupal',
  'password' => 'drupal',
  'prefix' => '',
  'host' => 'be_gifts_mariadb',
  'port' => '3306',
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
);
