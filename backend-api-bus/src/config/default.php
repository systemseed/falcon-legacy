<?php
return [
  'settings' => [
    // Set to false in production.
    'displayErrorDetails' => FALSE,
    // Allow the web server to send the content-length header.
    'addContentLengthHeader' => FALSE,
    // Monolog settings.
    'logger' => [
      'name' => 'slim-app',
      'path' => __DIR__ . '/../../logs/app.log',
      'level' => \Monolog\Logger::DEBUG,
    ],
    'endpoints' => [
      'backend-donations' => [
        'user' => 'falcon',
        'password' => 'FALC0n$!',
        'oauth' => [
          'client_id' => '', // @todo add oauth credentials see: /admin/config/people/simple_oauth/oauth2_client
          'client_secret' => ''
        ]
      ],
      'backend-gifts' => [
        'user' => 'falcon',
        'password' => 'FALC0n$!',
        'oauth' => [
          'client_id' => '', // @todo add oauth credentials see: /admin/config/people/simple_oauth/oauth2_client
          'client_secret' => ''
        ]
      ]
    ],
    'cors_origin' => ['https://www.falcon.systemseed.com']
  ],
];
