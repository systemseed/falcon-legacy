import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import PaymentButtons from '../PaymentButtons';
import * as checkoutActions from '../../actions/checkout';
import * as checkoutUtils from '../../utils/checkout';

class CheckoutPaymentContainer extends Component {
  onFakeSubmit() {
    const { dispatch } = this.props;

    // It just adds class .showErrors and errors are getting visible to the user.
    dispatch(checkoutActions.showErrors());
  }

  render() {
    const { validated, showErrors } = this.props;
    const btnCls = showErrors ? ' show-errors' : '';
    return (
      <div className="checkout-payment-container">
        {validated !== true &&
          <div className="checkout-payment-fake-button">
            <button
              className={`btn btn-primary btn-block btn-checkout space-top-none${btnCls}`}
              onClick={this.onFakeSubmit.bind(this)}
            >Continue to payment</button>
            {showErrors &&
              <div className="error-message">* Please fill in all required fields to continue.</div>
            }
          </div>
        }
        <PaymentButtons show={validated} />
      </div>
    );
  }
}

CheckoutPaymentContainer.propTypes = {
  validated: PropTypes.bool.isRequired,
  showErrors: PropTypes.bool,
  dispatch: PropTypes.func
};

const mapStateToProps = state => ({
  validated: checkoutUtils.isCheckoutValidated(state),
  showErrors: state.checkout.showErrors
});

export default connect(mapStateToProps)(CheckoutPaymentContainer);
