import React from 'react';
import PropTypes from 'prop-types';
import { getCurrencySymbol } from '../../../utils/currency';

/**
 * Donation input field with Currency prefix.
 */
const AmountWithCurrency = ({ currencyCode, innerRef, ...attributes }) => {
  return (
    <div className="amount-with-currency">
      <span className="amount-with-currency__currency">{getCurrencySymbol(currencyCode)}</span>
      <input className="amount-with-currency__input" type="number" min="0" name="donation_amount" ref={innerRef} {...attributes} />
    </div>
  );
};

AmountWithCurrency.propTypes = {
  currencyCode: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};

export default AmountWithCurrency;
