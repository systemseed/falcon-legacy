import { combineReducers } from 'redux';
import _cloneDeep from 'lodash/cloneDeep';

const basketProducts = (state = [], action) => {
  let index;
  let storedProduct;

  switch (action.type) {

    case 'BASKET_ADD_PRODUCT':

      const { product } = action;

      // Search for the product being added in the basket.
      index = state.findIndex(element => element.id === product.id);

      // If the product was found in the basket, then
      // fetch it and increase the quantity.
      if (index !== -1) {
        storedProduct = state[index];
        storedProduct.quantity++;

        return [
          ...state.slice(0, index),
          storedProduct,
          ...state.slice(index + 1)
        ];
      }

      // If the product doesn't exist in the basket yet,
      // simply add.
      return [
        ...state,
        {
          id: product.id,
          quantity: 1,
          path: product.path,
          data: product
        }
      ];

    case 'BASKET_REMOVE_PRODUCT':

      // Search for the product being added in the basket.
      index = state.findIndex(element => element.id === action.productId);

      // If the product was found in the basket, then
      // we simply remove it.
      if (index !== -1) {
        return [
          ...state.slice(0, index),
          ...state.slice(index + 1)
        ];
      }

      return [
        ...state,
      ];

    case 'BASKET_CLEAR':
    case 'CHECKOUT_COMPLETE':
      return [];

    case 'BASKET_INCREASE_PRODUCT_QUANTITY':

      // Search for the product being added in the basket.
      index = state.findIndex(element => element.id === action.productId);

      storedProduct = state[index];
      storedProduct.quantity++;

      return [
        ...state.slice(0, index),
        storedProduct,
        ...state.slice(index + 1)
      ];

    case 'BASKET_DECREASE_PRODUCT_QUANTITY':

      // Search for the product being added in the basket.
      index = state.findIndex(element => element.id === action.productId);

      storedProduct = state[index];
      storedProduct.quantity--;

      return [
        ...state.slice(0, index),
        storedProduct,
        ...state.slice(index + 1)
      ];

    case 'BASKET_ADD_CUSTOM_PRICE_PRODUCT':

      index = state.findIndex(element => element.id === action.product.id);

      // If custom price product already exists in the basket
      // then we take its object from the redux storage.
      if (index !== -1) {
        // TODO: get rid of _cloneDeep.
        storedProduct = _cloneDeep(state[index]);
        storedProduct.data.price.amount += action.amount;
        return [
          ...state.slice(0, index),
          storedProduct,
          ...state.slice(index + 1)
        ];
      }

      // Otherwise we use the product object being added
      // to the basket.
      storedProduct = _cloneDeep(action.product);
      storedProduct.price.amount += action.amount;
      return [
        ...state,
        {
          id: storedProduct.id,
          quantity: 1,
          data: storedProduct
        }
      ];

    default:
      return state;
  }
};

const basketType = (state = '', action) => {
  const { product } = action;

  switch (action.type) {

    // Automatically set type when the first
    // product is being added.
    case 'BASKET_ADD_PRODUCT':
    case 'BASKET_ADD_CUSTOM_PRICE_PRODUCT':
      return product.type;

    case 'BASKET_CLEAR':
    case 'CHECKOUT_COMPLETE':
      return '';

    default:
      return state;
  }
};

export default combineReducers({
  products: basketProducts,
  type: basketType,
});
