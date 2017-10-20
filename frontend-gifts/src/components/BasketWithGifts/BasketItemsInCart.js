import React from 'react';
import { FormattedPlural } from 'react-intl';

const BasketItemsInCart = ({ count }) => (
  <p className="text-sm">
    <span className="text-gray">Currently</span>
    &nbsp;{ count }&nbsp;
    <FormattedPlural
      value={count}
      one="item"
      other="items"
    />
    <span className="text-gray"> in cart</span>
  </p>
);

BasketItemsInCart.propTypes = {
  count: React.PropTypes.number.isRequired,
};

export default BasketItemsInCart;
