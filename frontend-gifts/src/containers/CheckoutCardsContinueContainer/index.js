import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as checkoutActions from '../../actions/checkout';
import * as checkoutUtils from '../../utils/checkout';
import CheckoutButton from '../CheckoutButton';

class CheckoutCardsContinueContainer extends Component {
  onFakeSubmit() {
    const { dispatch } = this.props;

    // It just adds class .showErrors and errors are getting visible to the user.
    dispatch(checkoutActions.showErrors());
  }

  render() {
    const { validated, showErrors } = this.props;
    const btnCls = showErrors ? ' show-errors' : '';
    return (
      <div className="checkout-cards-continue-container">
        {validated !== true &&
        <div>
          <button
            className={`btn btn-primary btn-block btn-checkout space-top-none checkout-submit-fake${btnCls}`}
            onClick={this.onFakeSubmit.bind(this)}
          >Continue checkout</button>
          {showErrors &&
          <div className="error-message">* Please fill in all required fields to continue.</div>
          }
        </div>
        }
        {validated === true &&
        <CheckoutButton
          className="btn btn-primary btn-block btn-checkout space-top-none checkout-submit-real"
        >Continue checkout</CheckoutButton>
        }
      </div>
    );
  }
}

CheckoutCardsContinueContainer.propTypes = {
  validated: PropTypes.bool.isRequired,
  showErrors: PropTypes.bool,
  dispatch: PropTypes.func
};

const mapStateToProps = state => ({
  validated: checkoutUtils.isCheckoutCardsValidated(state),
  showErrors: state.checkout.showErrors
});

export default connect(mapStateToProps)(CheckoutCardsContinueContainer);
