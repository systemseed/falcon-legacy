import React, { Component, PropTypes } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as checkoutActions from '../../actions/checkout';
import * as basketUtils from '../../utils/basket';

class Stripe extends Component {

  onToken = (token) => {
    const { paymentMethod, dispatch } = this.props;
    dispatch(checkoutActions.placeOrder({ ...paymentMethod, stripe_token: token.id }));
  };

  render = () => {
    const { total, currency, paymentMethod, email } = this.props;
    const stripeKey = paymentMethod.configuration.mode === 'live' ? paymentMethod.configuration.publishable_key : paymentMethod.configuration.publishable_key_test;

    return (
      <StripeCheckout
        token={this.onToken}
        stripeKey={stripeKey}
        email={email}
        amount={total * 100}
        currency={currency}
      />
    );
  };
}

Stripe.propTypes = {
  paymentMethod: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  dispatch: PropTypes.func,
};

const mapStateToProps = state => ({
  total: basketUtils.getTotal(state.basket.products, state.currentCurrency),
  currency: state.currentCurrency,
  email: state.checkout.form.profile.formData.field_profile_email
});

export default connect(mapStateToProps)(Stripe);
