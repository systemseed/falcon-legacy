<?php
/**
 * @file
 * An example settings.local.php file for Drupal. SystemSeed updated version.
 */

assert_options(ASSERT_ACTIVE, TRUE);
\Drupal\Component\Assertion\Handle::register();

# Display all errors.
$config['system.logging']['error_level'] = 'verbose';

// Set private files folder.
$settings['file_private_path'] = preg_replace('~/web$~', '/private', $app_root);

// Enable local development services.
$settings['container_yamls'][] = __DIR__ . '/services.development.yml';

// Configure base url for images going outside of the site.
$config['rest_absolute_urls']['base_url'] = 'http://donations.api.flc.local';
$settings['file_public_base_url'] = 'http://donations.api.flc.local/sites/default/files';

// Make default hash salt for local envs.
$settings['hash_salt'] = 'insecure-local-hash';

$databases['default']['default'] = array (
  'database' => 'drupal',
  'username' => 'drupal',
  'password' => 'drupal',
  'prefix' => '',
  'host' => 'be_donations_mariadb',
  'port' => '3306',
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
);

$settings['trusted_host_patterns'] = [
  '^.*$',
];
