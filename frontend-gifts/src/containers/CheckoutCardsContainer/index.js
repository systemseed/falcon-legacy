import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import * as basketUtils from '../../utils/basket';
import * as checkoutUtils from '../../utils/checkout';
import CheckoutCardsList from './CheckoutCardsList';

// Manage Gift cards configuration.
class CheckoutCardsContainer extends Component {
  render() {
    const { basketType, cardItems, dispatch, siteContentSettings, isEmpty } = this.props;

    if (isEmpty) {
      return (
        <p>Your basket is empty.</p>
      );
    }

    // Do not render pane for corporate gifts.
    if (basketType !== 'gift' || cardItems.length === 0) {
      return null;
    }
    return (
      <Row className="checkout-cards-list">
        <Col xs={12}>
          {siteContentSettings.fieldConfigCheckoutStep1 &&
            <h3>{siteContentSettings.fieldConfigCheckoutStep1}</h3>
          }
          {siteContentSettings.fieldConfigCheckoutCards && siteContentSettings.fieldConfigCheckoutCards.value &&
            <div className="text-gray text-md" dangerouslySetInnerHTML={{ __html: siteContentSettings.fieldConfigCheckoutCards.value }} />
          }
          <CheckoutCardsList cards={cardItems} dispatch={dispatch} />
        </Col>
      </Row>
    );
  }
}

CheckoutCardsContainer.defaultProps = {
  cardItems: []
};

CheckoutCardsContainer.propTypes = {
  basketType: PropTypes.string,
  cardItems: PropTypes.array,
  dispatch: PropTypes.func,
  siteContentSettings: PropTypes.object.isRequired,
  isEmpty: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  basketType: state.basket.type,
  // One card item per product item. It stores all necessary configuration for
  // sending card to the backend.
  cardItems: checkoutUtils.getGiftCardItems(state),
  dispatch: PropTypes.func,
  siteContentSettings: state.siteContentSettings.data,
  isEmpty: !basketUtils.getItemsCount(state.basket.products, state.currentCurrency),
});

export default connect(mapStateToProps)(CheckoutCardsContainer);
