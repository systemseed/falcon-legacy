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
    return (
      <div>
        {validated !== true &&
          <div>
            <button
              className="btn btn-primary btn-block space-top-none"
              onClick={this.onFakeSubmit.bind(this)}
            >Continue to payment</button>
            {showErrors &&
              <p>Please fill in all required fields to continue.</p>
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
