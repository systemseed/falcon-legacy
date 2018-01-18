import React from 'react';
import PropTypes from 'prop-types';
import { getCurrencySymbol } from '../../../utils/currency';

const AmountWithCurrency = ({ currencyCode, onChange, innerRef, ...attributes }) => {
  return (
    <div className="amount-with-currency">
      <span className="amount-with-currency__currency">{ getCurrencySymbol(currencyCode) }</span>
      <input type="number" min="0" name="donation_amount" ref={innerRef} onChange={onChange} {...attributes} />
    </div>
  );
};

AmountWithCurrency.propTypes = {
  currencyCode: PropTypes.string,
  onChange: PropTypes.func,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};

export default AmountWithCurrency;
