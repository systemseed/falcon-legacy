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

    // TODO: check event code.
  }

  /**
   * Helper function to sync Gifts ThankQ.
   */
  public function runGiftsThankQSync($order_id, $products, $profile_data, $currency) {
    $I = $this;
    $total_amount = 0;

    foreach ($products as $product) {
      $total_amount += $product['price'][$currency]['number'];
    }

    $total_amount = number_format($total_amount, 2, '.', '');

    $I->amOnPage('/admin/thankq/run/gifts');
    // Make sure the order is ready for export.

    $order_string = $profile_data['root_field_profile_email'] . ' - ' . $total_amount . ' ' . $currency;
    $I->see($order_string);

    // Make sure correct ThankQ instance is chosen.
    $I->expectTo('See correct ThankQ instance chosen');
    if ($currency === 'EUR') {
      $I->see('using TeleServiceCCNDtest database');
    }
    elseif ($currency == 'GBP') {
      $I->see('using TeleServiceCCNUKtest database');
    }

    // Start synchronisation.
    $I->click('#edit-submit');

    // Wait for success message for this order.
    $I->waitForText($order_string, 90, '.messages--status');

    $I->amOnPage("/admin/commerce/orders/$order_id/thankq");
    $I->dontSee('This order was not exported into ThankQ');

    $I->expectTo('See correct total amount pushed to ThankQ');
    $I->see($total_amount, '.ordervalue');
    $I->see($total_amount, '.paid');

    $I->expectTo('See correct all ordered products pushed to ThankQ');
    foreach ($products as $product) {
      $line_total = number_format($product['price'][$currency]['number'], 4, '.', '');
      $I->see($product['title'], '.name');
      $I->see($line_total, '.linetotal');
    }

    $I->expectTo('See correct profile data pushed to ThankQ');
    $I->see($profile_data['root_field_profile_email'], '.emailaddress');
    $I->see($profile_data['root_field_profile_first_name'], '.firstname');
    $I->see($profile_data['root_field_profile_last_name'], '.keyname');
    // NOTE: line 1 and line 2 should be in ThankQ field addressline1.
    $I->see($profile_data['root_address_line1'], '.addressline1');
    $I->see($profile_data['root_address_line2'], '.addressline1');
    $I->see($profile_data['root_locality'], '.addressline3');
    $I->see($profile_data['root_field_profile_phone'], '.mobilenumber');

    if ($I->getRegion() == 'ie') {
      $I->see($profile_data['root_administrative_area'], '.addressline4');
    }
  }
}
