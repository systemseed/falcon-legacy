import React, { Component } from 'react';
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
    // If there are products in basket and no card items yet then initialize process of preparing cards.
    this.initCardItems(newProps);

    // Perform API call as soon as store informs about successful payment.
    if (this.props.orderUuid === '' && newProps.orderUuid !== '') {
      // TODO: rework with dispatch.
      this.sendEmailCards(newProps.orderUuid, newProps.cardItems.filter(card => card.type === 'email'));
    }
  }

  componentDidMount() {
    // If there are products in basket and no card items yet then initialize process of preparing cards.
    this.initCardItems(this.props);
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
        // This param is currently disabled.
        // ending_timestamp: moment.utc(card.emailFormData.sending_date, 'YYYY-MM-DD').format('X')
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

  // Prepare card item objects for each product item.
  // Card items are stored in redux store and used in child components to view / edit / preview cards.
  initCardItems(props) {
    const { basketType, products, cardConfigs, dispatch } = props;
    const cardItems = {};

    const configsIsNotLoaded = !cardConfigs.isPending && !cardConfigs.isFulfilled && !cardConfigs.isError;

    // Init API call for card configs.
    if (configsIsNotLoaded && products.length > 0) {
      dispatch(checkoutActions.loadProductCardConfigs(
        products.map(product => product.id)
      ));
    }

    // All required data is loaded. Prepare card items.
    // TODO: move to reducer.
    if (cardConfigs.isFulfilled && props.cardItems.length === 0 && products.length > 0) {
      products.forEach((product) => {
        if (product.data.variantType === 'normal') {
          for (let i = 0; i < product.quantity; i += 1) {
            const cardIndex = `${product.id}.${i}`;
            cardItems[cardIndex] = {
              cardIndex,
              product: product.data,
              cardConfigs: cardConfigs.byProductId[product.id] ? cardConfigs.byProductId[product.id] : {},
              type: 'physical',
              emailFormData: {
                // This param is currently disabled.
                // sending_date: moment().format('YYYY-MM-DD')
              },
              validated: false
            };
          }
        }
      });
      dispatch(checkoutActions.checkoutCardsInit(basketType, cardItems));
    }
  }

  render() {
    const { basketType, cardItems, dispatch } = this.props;

    // Do not render pane for corporate gifts.
    if (basketType !== 'gift') {
      return null;
    }
    return (
      <Row className="checkout-cards-list">
        <Col xs={12}>
          <h3>Step 2 - Choose a card to go with your gifts</h3>
          <p className="text-gray text-sm">
            <strong>Each gift comes with either an e-card or a postal card</strong>. All you have to do is choose which one you want your relative or friend to receive. If you choose to send an e-card, we’ll send it directly on your behalf. If you would prefer to give a postal card, we will post it to you and you’ll be able to deliver it in person.
          </p>
          {cardItems.length > 0 &&
          <CheckoutCardsList cards={cardItems} dispatch={dispatch} />
          }
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

const mapStateToProps = state => ({
  products: basketUtils.getProducts(state.basket.products, state.currentCurrency),
  basketType: state.basket.type,
  // One card item per product item. It stores all necessary configuration for sending card to the backend.
  cardItems: checkoutUtils.getGiftCardItems(state),
  // Card configs are stored in Gifts backend. Each product MAY have configuration for physical and/or email cards.
  cardConfigs: state.checkout.cardConfigs,
  // Order id is now used as an indicator of successful payment.
  orderUuid: state.checkout.order.order_uuid,
  // Data from profile form is used in E-Card preview.
  senderFirstName: state.checkout.form.profile.formData.field_profile_first_name,
  senderLastName: state.checkout.form.profile.formData.field_profile_last_name
});

export default connect(mapStateToProps)(CheckoutCardsContainer);
