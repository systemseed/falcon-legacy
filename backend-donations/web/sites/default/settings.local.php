<?php
/**
 * @file
 * An example settings.local.php file for Drupal. SystemSeed updated version.
 */

assert_options(ASSERT_ACTIVE, TRUE);
\Drupal\Component\Assertion\Handle::register();

// Set private files folder.
$settings['file_private_path'] = preg_replace('~/web$~', '/private', $app_root);

// Enable local development services.
$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/development.services.yml';

$settings['hash_salt'] = 'Qf7s6_7c-W3lpFljM8ZSfYuUbAH6Ha5ldqFpJ177TzGggpOzVk9DI0OIsy80T58WU9uGkfsRCA';

// Configure base url for images going outside of the site.
$config['rest_absolute_urls']['base_url'] = 'http://donations.api.flc.local';

$databases['default']['default'] = array(
  'driver' => 'mysql',
  'host' => 'be_donations_mariadb',
  'username' => 'drupal',
  'password' => 'drupal',
  'database' => 'drupal',
  'prefix' => '',
);
