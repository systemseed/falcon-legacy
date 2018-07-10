import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as regionUtils from '../../utils/region';
import CheckoutContainerGB from './gb/CheckoutContainer';
import CheckoutContainerIE from './ie/CheckoutContainer';
import * as checkoutUtils from '../../utils/checkout';
import * as basketUtils from '../../utils/basket';
import api from '../../lib/api';
import * as checkoutActions from '../../actions/checkout';

// TODO: this component is now a mix of old/new approaches to redux.
class CheckoutContainer extends Component {

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
    let sequencePromise = Promise.resolve();
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
    return regionUtils.isRegionGB() ? <CheckoutContainerGB /> : <CheckoutContainerIE />;
  }

}

CheckoutContainer.defaultProps = {
  products: [],
  cardItems: [],
  orderUuid: ''
};

CheckoutContainer.propTypes = {
  orderUuid: PropTypes.string,
  senderFirstName: PropTypes.string,
  senderLastName: PropTypes.string,
  cardItems: PropTypes.array, // eslint-disable-line react/no-unused-prop-types
  dispatch: PropTypes.func,
};

const mapStateToProps = state => ({
  products: basketUtils.getProducts(state.basket.products, state.currentCurrency),
  // One card item per product item. It stores all necessary configuration for
  // sending card to the backend.
  cardItems: checkoutUtils.getGiftCardItems(state),
  // Order id is now used as an indicator of successful payment.
  orderUuid: state.checkout.order.order_uuid,
  // Data from profile form is used in E-Card preview.
  senderFirstName: state.checkout.form.profile.formData.field_profile_first_name,
  senderLastName: state.checkout.form.profile.formData.field_profile_last_name,
  dispatch: PropTypes.func,
});

export default connect(mapStateToProps)(CheckoutContainer);
