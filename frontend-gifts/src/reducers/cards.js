import { combineReducers } from 'redux';

const items = (state = false, action) => {
  const defaults = {
    type: 'physical',
    emailFormData: {},
    validated: false
  };

  switch (action.type) {
    case 'BASKET_ADD_PRODUCT': {
      // Cards supported for normal and bundle gifts only.
      if (action.product.variantType !== 'normal' && action.product.variantType !== 'bundle') {
        return state;
      }

      // Initiate empty cards array if this product is not in the basket yet.
      // Otherwise works as BASKET_INCREASE_PRODUCT_QUANTITY.
      const productCards = state[action.product.id] ? state[action.product.id] : [];

      return {
        ...state,
        [action.product.id]: [
          ...productCards,
          {
            ...defaults,
            cardIndex: `${action.product.id}.${productCards.length}`,
            product: action.product
          }
        ]
      };
    }
    case 'BASKET_INCREASE_PRODUCT_QUANTITY':
      return {
        ...state,
        [action.productId]: [
          ...state[action.productId],
          {
            ...defaults,
            cardIndex: `${action.productId}.${state[action.productId].length}`,
            product: action.product
          }
        ]
      };

    case 'BASKET_DECREASE_PRODUCT_QUANTITY':
      return {
        ...state,
        [action.productId]: [
          ...state[action.productId].slice(0, -1)
        ]
      };

    case 'BASKET_REMOVE_PRODUCT': {
      const { [action.productId]: omit, ...newState } = state;
      return newState;
    }
    case 'BASKET_CLEAR':
      // Reset cards on any basket change.
      return false;

    case 'CHECKOUT_CARD_TYPE_CHANGED': {
      // Get product id and card index from passed string.
      const [productId, cardId] = action.cardIndex.split('.', 2);
      const index = parseInt(cardId, 10);
      // Prepare unmodified cardItem from the state.
      const cardItem = state[productId][index];

      return {
        ...state,
        [productId]: [
          ...state[productId].slice(0, index),
          { ...cardItem, type: action.cardType },
          ...state[productId].slice(index + 1),
        ]
      };
    }
    case 'CHECKOUT_CARD_EMAIL_FORM_CHANGED': {
      // Get product id and card index from passed string.
      const [productId, cardId] = action.cardIndex.split('.', 2);
      const index = parseInt(cardId, 10);
      // Prepare unmodified cardItem from the state.
      const cardItem = state[productId][index];

      return {
        ...state,
        [productId]: [
          ...state[productId].slice(0, index),
          {
            ...cardItem,
            emailFormData: action.emailFormData,
            validated: action.validated
          },
          ...state[productId].slice(index + 1),
        ]
      };
    }
    case 'CHECKOUT_COMPLETE':
      // Clean up.
      return false;

    default:
      return state;
  }
};

const sent = (state = false, action) => {
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

export default combineReducers({
  items,
  sent
});
