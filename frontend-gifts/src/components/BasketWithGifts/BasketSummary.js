import React, { PropTypes } from 'react';
import { FormattedPlural } from 'react-intl';
import BasketTotal from '../BasketTotal';

const BasketSummary = ({ total, currency, count, className }) => (
  <div className={className}>
    Basket subtotal
    {
      count &&
      <span>
        {' '}({count} <FormattedPlural value={count} one="item" other="items" />)
      </span>
    }
    : <div className="amount text-danger">
      <BasketTotal total={total} currentCurrency={currency} />
    </div>
  </div>
);

BasketSummary.defaultProps = {
  className: 'basket-summary',
};

BasketSummary.propTypes = {
  count: PropTypes.number,
  total: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default BasketSummary;
