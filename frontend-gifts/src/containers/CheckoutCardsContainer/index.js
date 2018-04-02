import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import * as basketUtils from '../../utils/basket';
import * as checkoutUtils from '../../utils/checkout';
import CheckoutCardsList from './CheckoutCardsList';
import * as checkoutActions from '../../actions/checkout';
import api from '../../lib/api';

// Manage Gift cards configuration on checkout form.
// TODO: this component is now a mix of old/new approaches to redux.
class CheckoutCardsContainer extends Component {

  componentWillReceiveProps(newProps) {
    // Perform API call as soon as store informs about successful payment.
    if (this.props.orderUuid === '' && newProps.orderUuid !== '') {
      // TODO: rework with dispatch.
      this.sendEmailCards(newProps.orderUuid, newProps.cardItems.filter(card => card.type === 'email'));
    }
  }

  // TODO: refactor with redux-promise-middleware.
  sendEmailCards(orderUuid, cards) {
    const { dispatch, senderFirstName, senderLastName } = this.props;

    // Create promise for each email card.
    const promises = cards.map((card) => {
      const attributes = {
        ...card.emailFormData,
        donations_order_uuid: orderUuid,
        donations_product_uuid: card.product.id,
        field_sender_first_name: senderFirstName,
        field_sender_last_name: senderLastName,
      };

      // Remove virtual fields.
      delete attributes.sending_date;

      dispatch(checkoutActions.checkoutCardsSending());
      return api.postEmailCard(card, attributes);
    });

    // TODO: Can multiple items be sent in one request?
    // Multiple parallel requests (Promise.all) can cause "Deadlock found when trying to get lock".
    // Execute requests one by one.
    var sequencePromise = Promise.resolve();
    promises.forEach((promise) => {
      sequencePromise = sequencePromise.then(() => promise);
    });

    sequencePromise
      .then(() => {
        // Inform other components that all work is done for gift cards.
        dispatch(checkoutActions.checkoutCardsSent());
      })
      .catch(() => {
        // Complete checkout even if cards are not successfully sent because user can't fix it.
        dispatch(checkoutActions.checkoutCardsSent());
      });
  }

  render() {
    const { basketType, cardItems, dispatch, siteContentSettings } = this.props;

    // Do not render pane for corporate gifts.
    if (basketType !== 'gift' || cardItems.length === 0) {
      return null;
    }
    return (
      <Row className="checkout-cards-list">
        <Col xs={12}>
          {siteContentSettings.fieldConfigCheckoutStep3 &&
            <h3>{siteContentSettings.fieldConfigCheckoutStep3}</h3>
          }
          {siteContentSettings.fieldConfigCheckoutCards && siteContentSettings.fieldConfigCheckoutCards.value &&
            <p className="text-gray text-sm" dangerouslySetInnerHTML={{ __html: siteContentSettings.fieldConfigCheckoutCards.value }} />
          }
          <CheckoutCardsList cards={cardItems} dispatch={dispatch} />
        </Col>
      </Row>
    );
  }
}

CheckoutCardsContainer.defaultProps = {
  products: [],
  cardItems: [],
  orderUuid: ''
};

CheckoutCardsContainer.propTypes = {
  orderUuid: PropTypes.string,
  senderFirstName: PropTypes.string,
  senderLastName: PropTypes.string,
  basketType: PropTypes.string,
  cardItems: PropTypes.array,
  dispatch: PropTypes.func,
  siteContentSettings: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  products: basketUtils.getProducts(state.basket.products, state.currentCurrency),
  basketType: state.basket.type,
  // One card item per product item. It stores all necessary configuration for
  // sending card to the backend.
  cardItems: checkoutUtils.getGiftCardItems(state),
  // Order id is now used as an indicator of successful payment.
  orderUuid: state.checkout.order.order_uuid,
  // Data from profile form is used in E-Card preview.
  senderFirstName: state.checkout.form.profile.formData.field_profile_first_name,
  senderLastName: state.checkout.form.profile.formData.field_profile_last_name,
  dispatch: PropTypes.func,
  siteContentSettings: state.siteContentSettings.data
});

export default connect(mapStateToProps)(CheckoutCardsContainer);
