<?php

// Do not import development configs on production.
$config['config_split.config_split.development']['status'] = FALSE;

// Don't show errors on live.
$config['system.logging']['error_level'] = 'hide';

// Enable css / js aggregation.
$config['system.performance']['css']['preprocess'] = TRUE;
$config['system.performance']['js']['preprocess'] = TRUE;
