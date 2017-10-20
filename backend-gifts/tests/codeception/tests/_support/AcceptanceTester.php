<?php


/**
 * Inherited Methods
 * @method void wantToTest($text)
 * @method void wantTo($text)
 * @method void execute($callable)
 * @method void expectTo($prediction)
 * @method void expect($prediction)
 * @method void amGoingTo($argumentation)
 * @method void am($role)
 * @method void lookForwardTo($achieveValue)
 * @method void comment($description)
 * @method \Codeception\Lib\Friend haveFriend($name, $actorClass = NULL)
 *
 * @SuppressWarnings(PHPMD)
*/
class AcceptanceTester extends \Codeception\Actor
{
  use _generated\AcceptanceTesterActions;

  /**
   * Get current region from Platform/Circle environment.
   *
   * @return string
   *  Either 'ie' or 'gb'. 'ie' is default.
   */
  public function getRegion() {
   return getenv('CW_REGION') ? getenv('CW_REGION') : 'ie';
  }

  /**
   * Simple implementation based on current region.
   *
   * @return string
   *   EUR or GBP
   */
  public function getCurrency() {
    if ($this->getRegion() == 'gb') {
      return 'GBP';
    }

    return 'EUR';
  }
}
