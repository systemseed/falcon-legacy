<?php
return [
  'settings' => [
    'endpoints' => [
      'backend-donations' => [
        'oauth' => [
          'client_id' => $_ENV['DONATIONS_CLIENT_ID'],
          'client_secret' => $_ENV['DONATIONS_CLIENT_SECRET'],
        ]
      ],
      'backend-gifts' => [
        'oauth' => [
          'client_id' => $_ENV['GIFTS_CLIENT_ID'],
          'client_secret' => $_ENV['GIFTS_CLIENT_SECRET'],

        ]
      ]
    ],
  ],
];
