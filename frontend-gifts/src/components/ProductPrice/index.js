import React from 'react';
import { FormattedNumber } from 'react-intl';

// Render product price in given currency.
const ProductPrice = ({ price, currentCurrency }) => (
  <FormattedNumber
    value={price}
    style="currency" // eslint-disable-line react/style-prop-object
    currency={currentCurrency}
  />
);

ProductPrice.propTypes = {
  price: React.PropTypes.number.isRequired,
  currentCurrency: React.PropTypes.string.isRequired
};

export default ProductPrice;
