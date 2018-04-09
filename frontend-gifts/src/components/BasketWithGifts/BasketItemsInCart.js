import React from 'react';
import { FormattedPlural } from 'react-intl';

const BasketItemsInCart = ({ count, className }) => (
  <p className={`text-sm ${className}`}>
    Currently <strong>{count} <FormattedPlural
      value={count}
      one="item"
      other="items"
    />
    </strong> in cart
  </p>
);

BasketItemsInCart.defaultProps = {
  className: '',
};

BasketItemsInCart.propTypes = {
  count: React.PropTypes.number.isRequired,
  className: React.PropTypes.string,
};

export default BasketItemsInCart;
