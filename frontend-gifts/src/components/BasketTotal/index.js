import React from 'react';
import { FormattedNumber } from 'react-intl';

const BasketTotal = ({ total, currentCurrency }) => (
  <FormattedNumber
    value={total}
    style="currency" // eslint-disable-line react/style-prop-object
    currency={currentCurrency}
  />
);

BasketTotal.propTypes = {
  total: React.PropTypes.number.isRequired,
  currentCurrency: React.PropTypes.string.isRequired,
};

export default BasketTotal;
