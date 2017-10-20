<?php
/**
 * Bootstrap Drupal codebase to get access to core and module functions.
 *
 * IMPORTANT: your Drupal copy must be connected to database.
 */
use Drupal\Core\DrupalKernel;
use Symfony\Component\HttpFoundation\Request;

$autoloader = require_once __DIR__ . '/../../../../web/autoload.php';

$request = Request::createFromGlobals();
$kernel = DrupalKernel::createFromRequest($request, $autoloader, 'prod', TRUE);
$kernel->prepareLegacyRequest($request);
