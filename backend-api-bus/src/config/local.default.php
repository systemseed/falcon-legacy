<?php
return [
  'settings' => [
    'displayErrorDetails' => TRUE,
    'endpoints' => [
      'backend-donations' => [
        'url' => 'http://be_donations_nginx',
        'public_host' => 'donations.api.flc.local',
        'consumer_id' => '', // TODO: add a consumer at admin/config/services/consumer
        'oauth' => [
          'client_id' => '', // @todo add oauth credentials see: /admin/config/people/simple_oauth/oauth2_client
          'client_secret' => ''
        ]
      ],
      'backend-gifts' => [
        'url' => 'http://be_gifts_nginx',
        'public_host' => 'gifts.api.flc.local',
        'consumer_id' => '', // TODO: add a consumer at admin/config/services/consumer
        'oauth' => [
          'client_id' => '', // @todo add oauth credentials see: /admin/config/people/simple_oauth/oauth2_client
          'client_secret' => ''
        ]
      ],
    ],
    'cors_origin' => ['*'],
  ],
];
