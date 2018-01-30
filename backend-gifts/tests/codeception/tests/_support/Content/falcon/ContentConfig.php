<?php

namespace falcon;

/**
 * Class ContentConfig
 *
 * Test content for content-sensitive Falcon tests. Extend this class in your
 * own namespace to overwrite demo content for your own Falcon setup.
 *
 * @package falcon
 */
class ContentConfig {

  static protected $project = 'Falcon';

  static protected $gift = [
    'id' => 13,
    'uuid' => '355215cd-f4f2-4525-a29b-54c26f8cc1ac',
    'title' => 'Piglet',
    'path' => '/gifts/piglet',
    'annotation' => 'Quisque cursus, metus vitae pharetra auctor',
    'description' => 'Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi.',
    'category' => 'Animal',
    'price' => [
      'EUR' => ['number' => 10.00, 'formatted' => '€10.00']
    ]
  ];

  static protected $corporateGift = [
    'id' => 16,
    'uuid' => 'afa5f334-5959-40fa-82e0-7c042d8819e4',
    'title' => 'Quisque volutpat',
    'path' => '/corporate/quisque-volutpat',
    'annotation' => 'Maecenas mattis. Sed convallis tristique sem!',
    'description' => 'Curabitur tortor. Pellentesque nibh. Aenean quam.',
    'price' => [
      'EUR' => ['number' => 900.00, 'formatted' => '€900.00'],
    ]
  ];

  static protected $profileData = [
    'root_field_profile_first_name' => 'Test',
    'root_field_profile_last_name' => 'Suite',
    'root_field_profile_email' => 'falcon.test-gifts.profile@systemseed.com',
    'root_field_profile_phone' => '12345678',
    'root_address_line1' => 'Address Line 1',
    'root_address_line2' => 'Address Line 2',
    'root_locality' => 'Dublin',
    'root_postal_code' => 'ASCN 1ZZ',
    'root_administrative_area' => 'Co. Dublin',
    'root_country_code' => 'Republic of Ireland',
    'optins' => [
      'root_field_profile_prefs_sms' => TRUE,
      'root_field_profile_prefs_phone' => TRUE,
      'root_field_profile_prefs_post' => TRUE,
      'root_field_profile_prefs_email' => FALSE,
    ],
  ];

  public static function getGiftData($prop = NULL) {
    if (empty($prop)) {
      return self::$gift;
    }

    return self::$gift[$prop];
  }

  public static function getCorporateGiftData($prop = NULL) {
    if (empty($prop)) {
      return self::$corporateGift;
    }

    return self::$corporateGift[$prop];
  }

  public static function getProfileData() {
    return self::$profileData;
  }

  public static function getProjectName() {
    return self::$project;
  }
}
