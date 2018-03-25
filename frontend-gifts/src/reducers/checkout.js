import { combineReducers } from 'redux';
import * as regionUtils from '../utils/region';
import * as checkoutGB from './gb/checkout';
import * as checkoutIE from './ie/checkout';

// TODO: remove region switching code from Falcon.
const checkoutForm = (state, action) => (regionUtils.isRegionGB()
  ? checkoutGB.checkoutForm(state, action)
  : checkoutIE.checkoutForm(state, action));

const showErrors = (state = false, action) => {
  switch (action.type) {
    case 'CHECKOUT_SHOW_ERRORS':
      return true;
    case 'CHECKOUT_HIDE_ERRORS':
    case 'CHECKOUT_FORM_RESET':
      return false;

    default:
      return state;
  }
};

const paymentMethods = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  paypal_button: null,
  stripe: null
}, action) => {
  let newState;

  switch (action.type) {

    case 'GET_PAYMENT_METHODS_PENDING':
      return {
        ...state,
        isPending: true
      };

    case 'GET_PAYMENT_METHODS_FULFILLED':
      newState = {
        isPending: false,
        isError: false,
        isFulfilled: true
      };
      action.payload.body.data.forEach((item) => {
        newState[item.plugin] = item;
      });

      return newState;

    case 'GET_EVENT_CODES_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };
    default:

      return state;
  }
};

const checkoutOrder = (state = {
  order_id: '',
  order_uuid: '',
  isPending: false,
  isFulfilled: false,
  isError: false
}, action) => {
  switch (action.type) {

    case 'POST_CHECKOUT_PENDING':
      return {
        ...state,
        isPending: true
      };

    case 'POST_CHECKOUT_FULFILLED':
      return {
        ...action.payload.body.data,
        isPending: false,
        isFulfilled: true,
        isError: false
      };

    case 'POST_CHECKOUT_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
        isFulfilled: false
      };
    case 'CHECKOUT_COMPLETE':
      // Clean up.
      return {
        order_id: '',
        order_uuid: '',
        isPending: false,
        isFulfilled: false,
        isError: false
      };
    default:

      return state;
  }
};

// Global pending status for overlay.
const checkoutIsProcessing = (state = false, action) => {
  switch (action.type) {

    case 'POST_CHECKOUT_PENDING':
    case 'CHECKOUT_CARDS_SENDING':
      return true;
    case 'POST_CHECKOUT_REJECTED':
    case 'CHECKOUT_COMPLETE':
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  processing: checkoutIsProcessing,
  order: checkoutOrder,
  // Main checkout form.
  form: checkoutForm,
  showErrors,
  paymentMethods
});
