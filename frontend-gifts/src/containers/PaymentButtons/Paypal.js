import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';
import { connect } from 'react-redux';
import * as checkoutActions from '../../actions/checkout';
import * as basketUtils from '../../utils/basket';

/* eslint-disable */
// TODO: Rework when https://github.com/paypal/paypal-checkout/issues/149 is released.

// Paypal Express Checkout button.
// 1. Paypal documentation: https://developer.paypal.com/docs/integration/direct/express-checkout/integration-jsv4/
// 2. Implementation for React: https://github.com/paypal/paypal-checkout/issues/149#issuecomment-274462633
// 3. Hybrid Paypal integration is used: create payment on client, execute payment on backend.
class Paypal extends Component {
  constructor(props) {
    super(props);
    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  state = {
    showButton: false
  };

  paypalStyle = {
    label: 'checkout', // checkout || credit
    size: 'responsive',    // tiny | small | medium
    shape: 'pill',     // pill | rect
    color: 'blue'      // gold | blue | silver
  };

  componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed }) {
    if (!this.state.showButton) {
      if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
        if (isScriptLoadSucceed) {
          // Paypal external script has been loaded.
          this.setState({ showButton: true });
        }
      }
    }
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;
    if (isScriptLoaded && isScriptLoadSucceed) {
      // Paypal external script has been loaded.
      this.setState({ showButton: true });
    }
  }

  componentWillUnmount() {
    delete window.React;
    delete window.ReactDOM;
  }

  render() {
    const { paymentMethod } = this.props;
    const env = paymentMethod.configuration.mode === 'live' ? 'production' : 'sandbox';
    const client = {
      [env]: paymentMethod.configuration.client_id
    };

    const payment = (resolve, reject) => {
      // If you need to implement validation,
      // see https://github.com/paypal/paypal-checkout/issues/139.

      const { total, currency, products } = this.props;

      return window.paypal.rest.payment.create(env, client, {
        transactions: [
          {
            amount: { total, currency },
            item_list: {
              items: products.map(product => ({
                currency,
                name: product.data.title,
                price: product.data.price[currency] ?
                  parseFloat(product.data.price[currency].amount).toFixed(2) :
                  parseFloat(product.data.price.amount).toFixed(2),
                quantity: product.quantity
              }))
            }
          }
        ]
      });
    };

    const onAuthorize = (data, actions) => {
      const { paymentMethod, dispatch } = this.props;
      dispatch(checkoutActions.placeOrder({ ...data, ...paymentMethod }));
    };

    if (this.state.showButton) {
      return (
        <window.paypal.Button.react
          env={env}
          client={client}
          payment={payment}
          commit
          onAuthorize={onAuthorize}
          style={this.paypalStyle}
        />
      );
    }

    return null;
  }

}

Paypal.propTypes = {
  paymentMethod: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  products: basketUtils.getProducts(state.basket.products, state.currentCurrency),
  total: basketUtils.getTotal(state.basket.products, state.currentCurrency),
  currency: state.currentCurrency
});

const PayPalButtonRedux = connect(mapStateToProps)(Paypal);

// Load paypal script.
// See https://github.com/paypal/paypal-checkout/issues/149#issuecomment-274462633
export default scriptLoader('https://www.paypalobjects.com/api/checkout.js')(PayPalButtonRedux);
