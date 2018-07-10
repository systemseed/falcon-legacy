import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as checkoutUtils from '../../utils/checkout';
import CardsSummary from '../../components/CardsSummary';

const CheckoutCardsSummary = ({ cardItems }) => (
  <div className="checkout-cards-summary">
    <CardsSummary
      postalCardsCount={checkoutUtils.getPostalCardsCount(cardItems)}
      emailCardsCount={checkoutUtils.getEmailCardsCount(cardItems)}
    />
  </div>
);

CheckoutCardsSummary.propTypes = {
  cardItems: PropTypes.array,
};

const mapStateToProps = state => ({
  cardItems: checkoutUtils.getGiftCardItems(state),
});

export default connect(mapStateToProps)(CheckoutCardsSummary);
