import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as checkoutActions from '../../actions/checkout';
import * as messageActions from '../../actions/messageBar';
import Stripe from './Stripe';
import Paypal from './Paypal';

class PaymentButtons extends Component {
  componentDidMount() {
    const { dispatch, paymentMethods } = this.props;

    if (!paymentMethods.isFulfilled && !paymentMethods.isPending) {
      dispatch(checkoutActions.getPaymentMethods());
    }
  }

  render() {
    const { dispatch, paymentMethods, order } = this.props;

    if (paymentMethods.isError) {
      dispatch(messageActions.show('Cannot load payment methods.', { type: 'error', timeout: 20000 }));
      return null;
    }
    if (!paymentMethods.isFulfilled) {
      return null;
    }

    if (order.isError && !order.isPending) {
      dispatch(messageActions.show('We couldn’t complete your payment. Please <a href="/contact">contact support</a> or try another payment method.', { type: 'error', timeout: 16000 }));
    }

    return (
      <div className="payment-buttons-wrapper">
        <div className="payment-buttons" style={{ display: this.props.show ? 'block' : 'none' }}>
          <h3 className="payment-options-label">Payment options:</h3>
          <div className="payment-option stripe">
            <Stripe paymentMethod={paymentMethods.stripe} />
          </div>
          <p className="payment-options-or-label">or</p>
          {typeof window !== 'undefined' &&
            <div className="payment-option paypal">
              <Paypal paymentMethod={paymentMethods.paypal_button} />
            </div>
          }
        </div>
      </div>
    );
  }
}

PaymentButtons.propTypes = {
  paymentMethods: PropTypes.object,
  order: PropTypes.object,
  show: PropTypes.bool,
  dispatch: PropTypes.func,
};

const mapStateToProps = state => ({
  paymentMethods: state.checkout.paymentMethods,
  order: state.checkout.order
});

export default connect(mapStateToProps)(PaymentButtons);
