import React, { PropTypes } from 'react';
import ContinueShopping from '../ContinueShopping';
import CheckoutButton from '../../containers/CheckoutButton';
import ArrowIcon from '../ArrowIcon';
import CheckoutCardsButton from '../../containers/CheckoutCardsButton';

const BasketNav = ({ withCheckout, corpGifts }) => (
  <div className="basket-nav">
    <ContinueShopping />
    {withCheckout && corpGifts &&
      <CheckoutButton className="btn btn-small btn-primary btn-checkout">
        Checkout <ArrowIcon direction="right" />
      </CheckoutButton>
    }
    {withCheckout && !corpGifts &&
      <CheckoutCardsButton className="btn btn-primary btn-small btn-checkout">
        Checkout <ArrowIcon direction="right" />
      </CheckoutCardsButton>
    }
  </div>
);

BasketNav.defaultProps = {
  withCheckout: true,
  corpGifts: false
};

BasketNav.propTypes = {
  withCheckout: PropTypes.bool,
  corpGifts: PropTypes.bool
};

export default BasketNav;
