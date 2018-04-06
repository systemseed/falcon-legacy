import React, { PropTypes } from 'react';
import ContinueShopping from '../ContinueShopping';
import CheckoutButton from '../../containers/CheckoutButton';
import ArrowIcon from '../ArrowIcon';

const BasketNav = ({ withCheckout }) => (
  <div className="basket-nav">
    <ContinueShopping />
    {withCheckout &&
      <CheckoutButton className="btn btn-small btn-primary btn-checkout">
        Checkout <ArrowIcon direction="right" />
      </CheckoutButton>
    }
  </div>
);

BasketNav.defaultProps = {
  withCheckout: true
};

BasketNav.propTypes = {
  withCheckout: PropTypes.bool
};

export default BasketNav;
