<?php

// Do not import development configs on production.
$config['config_split.config_split.development']['status'] = FALSE;

// Don't show errors on live.
$config['system.logging']['error_level'] = 'hide';

// Enable css / js aggregation.
$config['system.performance']['css']['preprocess'] = TRUE;
$config['system.performance']['js']['preprocess'] = TRUE;

// ThankQ URLs for ROI and UK.
// TODO: Replace "test" with "live" when Gifts site goes live.
// TODO: Provide correct ThankQ urls.
$config['falcon_thankq.config']['wsdl_uri'] = '';

// Disable test mode for master environment.
$config['cw_core.settings']['test_mode_enabled'] = FALSE;
