<?php
namespace Step\Acceptance;

class DonationsBackendTester extends DrupalTester {

  /**
   * Helper function to check order data in Donations backend.
   *
   * @param $order_id
   * @param $products
   * @param $profile_data
   * @param $currency
   */
  public function checkOrderData($order_id, $products, $profile_data, $currency) {
    $I = $this;

    // This test supports only one product but can be refactored.
    $gift_data = array_pop($products);

    $I->amGoingTo('Visit order page in Donations backend');
    $I->amOnPage('admin/commerce/orders/' . $order_id);

    $I->expectTo('See purchased product title');

    $I->expectTo('See correct order total');
    $I->canSee($gift_data['price'][$currency]['formatted'], '.views-field-total-price__number');

    $I->expectTo('See correct order status');
    $I->canSee('Completed');

    $I->expectTo('See correct customer profile');
    $I->canSee($profile_data['root_field_profile_first_name']);
    $I->canSee($profile_data['root_field_profile_last_name']);
    $I->canSee($profile_data['root_field_profile_email']);
    $I->canSee($profile_data['root_field_profile_phone']);
    $I->canSee($profile_data['root_address_line1']);
    $I->canSee($profile_data['root_address_line2']);
    $I->canSee($profile_data['root_locality']);

    foreach ($profile_data['optins'] as $form_key => $value) {
      $class_name = '.field--name-' . str_replace(['root_', '_'], ['root_' => '', '_' => '-'], $form_key);
      if ($value === FALSE) {
        $I->canSee('No', $class_name);
      }
      else {
        $I->canSee('Yes', $class_name);
      }
    }
  }
}
