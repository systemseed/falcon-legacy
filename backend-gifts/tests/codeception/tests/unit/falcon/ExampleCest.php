<?php


class ExampleCest
{

  /**
   * @param \UnitTester $I
   */
    public function testNodeCreateClass(UnitTester $I) {
      $type = 'article';
      $title = 'Test Article';

      $I->amGoingTo("create new Drupal Node object of type $type with title $title");
      $node = \Drupal\node\Entity\Node::create([
        'type' => $type,
        'title' => $title,
      ]);

      $I->expectTo('See core label method returns correct title');
      $I->assertEquals($node->label(), $title);
      $I->expectTo('See core bundle method returns correct bundle name');
      $I->assertEquals($node->bundle(), $type);
    }

  /**
   * @param \UnitTester $I
   */
    public function testSharedFunction(UnitTester $I) {
      //$I->amGoingTo('Pass valid and invalid arrays to cw_gifts_test_is_array_valid and make sure it works as expected');

      /*$I->expectTo('see that empty array is not valid');
      $I->assertFalse(cw_gifts_test_is_array_valid([]));
      $I->expectTo('see that array without valid_param is not valid');
      $I->assertFalse(cw_gifts_test_is_array_valid(['a' => 'b']));
      $I->expectTo('see that array without valid_param equal to 1 is not valid');
      $I->assertFalse(cw_gifts_test_is_array_valid(['valid_param' => 1]));
      $I->expectTo('see that array without valid_param equal to TRUE is valid');
      $I->assertTrue(cw_gifts_test_is_array_valid(['valid_param' => TRUE]));*/
    }
}
