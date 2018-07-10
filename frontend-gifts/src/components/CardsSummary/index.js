import React, { PropTypes } from 'react';
import { FormattedPlural } from 'react-intl';

const BasketSummary = ({ postalCardsCount, emailCardsCount, className }) => (
  <div className={className}>
    {
      !!postalCardsCount &&
      <div className="cards-summary-postal">
        {postalCardsCount} <FormattedPlural value={postalCardsCount} one="Postal Card" other="Postal Cards" />
      </div>
    }
    {
      !!emailCardsCount &&
      <div className="cards-summary-email">
        {emailCardsCount} <FormattedPlural value={emailCardsCount} one="E-Card" other="E-Cards" />
      </div>
    }
  </div >
);

BasketSummary.defaultProps = {
  className: 'cards-summary',
};

BasketSummary.propTypes = {
  postalCardsCount: PropTypes.number,
  emailCardsCount: PropTypes.number,
  className: PropTypes.string,
};

export default BasketSummary;
