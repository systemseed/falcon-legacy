import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withDone as withServerDone } from 'react-router-server';
import { Modal } from 'react-bootstrap';
import CheckoutCardsContainer from '../../../containers/CheckoutCardsContainer';
import CheckoutFormProfile from '../CheckoutFormProfile';
import config from '../../../config';
import CheckoutFormAddress from '../CheckoutFormAddress';
import CheckoutFormOptins from '../CheckoutFormOptins';
import CheckoutFormEventCodes from '../CheckoutFormEventCodes';
import * as checkoutActions from '../../../actions/checkout';
import * as eventcodeActions from '../../../actions/eventcodes';
import * as basketUtils from '../../../utils/basket';
import * as checkoutUtils from '../../../utils/checkout';


// Main checkout container.
class CheckoutContainer extends Component {

  constructor(props) {
    super(props);

    this.onProfileChange = this.onProfileChange.bind(this);
    this.onAddressChange = this.onAddressChange.bind(this);
    this.onAOptinsChange = this.onAOptinsChange.bind(this);
    this.onEventCodeChange = this.onEventCodeChange.bind(this);
  }

  componentWillMount() {
    const { eventcodes, dispatch, done } = this.props;

    // Clean-up the form on every component mount.
    dispatch(checkoutActions.reset());

    if (!eventcodes.isPending && !eventcodes.codes.length) {
      dispatch(eventcodeActions.getAll()).then(done, done);
    }
  }

  // Callbacks below save form data in redux store.
  onProfileChange(formData, validated) {
    this.props.dispatch(checkoutActions.formChanged('profile', formData, validated));
  }
  onAddressChange(formData, validated) {
    this.props.dispatch(checkoutActions.formChanged('address', formData, validated));
  }
  onAOptinsChange(formData, validated) {
    this.props.dispatch(checkoutActions.formChanged('optins', formData, validated));
  }
  onEventCodeChange(formData, validated) {
    this.props.dispatch(checkoutActions.formChanged('eventcode', formData, validated));
  }

  render() {
    const {
      showCards,
      showThankYouPage,
      isEmpty,
      showErrors,
      orderId,
      eventcodes,
      processing
    } = this.props;

    if (showThankYouPage) {
      return <Redirect to={`/checkout/${orderId}/complete`} />;
    }

    if (isEmpty) {
      return (
        <p>Your basket is empty.</p>
      );
    }

    return (
      <div className={showErrors ? 'showErrors' : null}>
        <h3>Step 1 - Enter your personal details</h3>
        {/* Different parts of the form are controlled by this container and built on top of CheckoutFormContainer */}
        <CheckoutFormProfile
          onFormValidate={this.onProfileChange}
        />
        <CheckoutFormAddress
          region={config.region}
          onFormValidate={this.onAddressChange}
        />
        {eventcodes.codes.length > 0 &&
          /* BE AWARE: checkout form doesn't work if there is no event codes in the system. */
          <CheckoutFormEventCodes
            codes={eventcodes.codes}
            labels={eventcodes.labels}
            onFormValidate={this.onEventCodeChange}
          />
        }
        <CheckoutFormOptins onFormValidate={this.onAOptinsChange} />
        {showCards &&
          /* Card container is special case. It manages everything related to cards. */
          <CheckoutCardsContainer />
        }
        {/* Block screen while checkout is processing. */}
        <Modal show={processing} backdrop="static" className="checkout-processing">
          <p className="loading-animation">Please wait<span>.</span><span>.</span><span>.</span></p>
        </Modal>
      </div>
    );
  }
}


CheckoutContainer.defaultProps = {
  showCards: false,
  showThankYouPage: false,
  orderId: ''
};

CheckoutContainer.propTypes = {
  showCards: PropTypes.bool.isRequired,
  showThankYouPage: PropTypes.bool.isRequired,
  orderId: PropTypes.string.isRequired,
  eventcodes: PropTypes.object.isRequired,
  showErrors: PropTypes.bool.isRequired,
  processing: PropTypes.bool.isRequired,
  isEmpty: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isEmpty: !basketUtils.getItemsCount(state.basket.products, state.currentCurrency),
  showCards: state.basket.type === 'gift',
  // Determines status of the order based on data in store.
  showThankYouPage: checkoutUtils.isCheckoutComplete(state),
  // The idea is to highlight errors on checkout button click only.
  showErrors: state.checkout.showErrors,
  orderId: state.checkout.order.order_id,
  eventcodes: state.eventcodes,
  processing: state.checkout.processing
});


export default withServerDone(connect(mapStateToProps)(CheckoutContainer));
