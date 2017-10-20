<?php

/**
 * Set up grouping for /v1 routes.
 **/

$app->group('/v1', function () use ($app) {
  // Call all routes methods for all /v1 APIs.
  \Routes\v1\Gifts::routes($app);
  \Routes\v1\Donations::routes($app);
});
