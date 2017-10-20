import { combineReducers } from 'redux';
import api from '../lib/api';
import * as regionUtils from '../utils/region';
import * as checkoutGB from './gb/checkout';
import * as checkoutIE from './ie/checkout';

const checkoutGiftCards = (state = false, action) => {
  switch (action.type) {
    case 'BASKET_ADD_PRODUCT':
    case 'BASKET_REMOVE_PRODUCT':
    case 'BASKET_CLEAR':
    case 'BASKET_INCREASE_PRODUCT_QUANTITY':
    case 'BASKET_DECREASE_PRODUCT_QUANTITY':
      // Reset cards on any basket change.
      return false;

    case 'CHECKOUT_CARD_INIT':
      if (action.basketType !== 'gift') {
        return false;
      }

      // Prepare new object with empty non-validated cards items for each product.
      if (state === false) {
        return action.cardItems;
      }

      // Cards configuration is already in place. Do nothing.
      return state;

    case 'CHECKOUT_CARD_TYPE_CHANGED':
      return {
        ...state,
        [action.cardIndex]: {
          ...state[action.cardIndex],
          type: action.cardType,

        }
      };

    case 'CHECKOUT_CARD_EMAIL_FORM_CHANGED':
      return {
        ...state,
        [action.cardIndex]: {
          ...state[action.cardIndex],
          emailFormData: action.emailFormData,
          validated: action.validated
        }
      };

    case 'CHECKOUT_COMPLETE':
      // Clean up.
      return false;

    default:
      return state;
  }
};

const checkoutCardsSent = (state = false, action) => {
  switch (action.type) {
    case 'CHECKOUT_CARDS_SENT':
      return true;
    case 'CHECKOUT_COMPLETE':
      // Clean up.
      return false;
    default:
      return state;
  }
};

const checkoutForm = (state, action) => {

  return regionUtils.isRegionGB() ? checkoutGB.checkoutForm(state, action) : checkoutIE.checkoutForm(state, action);
};

const checkoutCardConfigs = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  byProductId: {}
}, action) => {
  const cardConfigs = {};

  switch (action.type) {
    case 'GET_CHECKOUT_CARD_CONFIGS_PENDING':
      return {
        ...state,
        isPending: true
      };

    case 'GET_CHECKOUT_CARD_CONFIGS_FULFILLED':
      // Process results of two API requests.
      action.payload.forEach((response) => {
        response.body.data.forEach((cardConfig) => {
          const type = cardConfig.type.replace('gift_card_config--', '');
          if (!cardConfigs[cardConfig.donationsProductUuid]) {
            cardConfigs[cardConfig.donationsProductUuid] = {};
          }

          cardConfig.imageUrl = false;
          if (cardConfig.fieldImage) {
            cardConfig.imageUrl = api.getImageUrl('gifts', cardConfig.fieldImage.fieldImage);
          }

          // There should be only one card config of this type for this product.
          cardConfigs[cardConfig.donationsProductUuid][type] = cardConfig;
        });
      });

      return {
        ...state,
        byProductId: cardConfigs,
        isPending: false,
        isFulfilled: true
      };

    case 'GET_CHECKOUT_CARD_CONFIGS_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true
      };

    case 'BASKET_ADD_PRODUCT':
    case 'BASKET_CLEAR':
    case 'CHECKOUT_COMPLETE':
      // Reset cardConfigs completely.
      return {
        isPending: false,
        isFulfilled: false,
        isError: false,
        byProductId: {}
      };
    default:
      return state;
  }
};

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
  // Cards form.
  cards: checkoutGiftCards,
  cardsSent: checkoutCardsSent,
  cardConfigs: checkoutCardConfigs,
  showErrors,
  paymentMethods
});
