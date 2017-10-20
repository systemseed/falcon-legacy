import React from 'react';
import * as popup from './popup';
import * as message from './messageBar';
import ConfirmChangeProduct from '../components/ConfirmChangeProduct';

const addProductUnsafe = product => ({
  type: 'BASKET_ADD_PRODUCT',
  product
});

const removeProductUnsafe = productId => ({
  type: 'BASKET_REMOVE_PRODUCT',
  productId
});

const addCustomPriceProductUnsafe = (product, amount) => ({
  type: 'BASKET_ADD_CUSTOM_PRICE_PRODUCT',
  product,
  amount,
});

export const clear = () => ({
  type: 'BASKET_CLEAR'
});

export const increaseProductQuantity = productId => ({
  type: 'BASKET_INCREASE_PRODUCT_QUANTITY',
  productId,
});

export const decreaseProductQuantity = productId => ({
  type: 'BASKET_DECREASE_PRODUCT_QUANTITY',
  productId,
});

export const removeProduct = productId => (dispatch, getState) => {
  const state = getState();
  // If last item is left in basket then call clear basket so
  // basket state is reset.
  if (state.basket.products.length === 1) {
    dispatch(clear());
  }
  else {
    dispatch(removeProductUnsafe(productId));
  }
};

/**
 * Checks if the current basket product is the same as the one being, if not then shows a dialog.
 */
export const addProduct = (product, router = null) => (dispatch, getState) => {
  const basketType = getState().basket.type;

  // Set default value for custom price product
  // @todo: update, when product detail page is done.
  if (product.variantType === 'custom_price') {
    product.price.amount = '1.00';
  }

  if (product.type === basketType || !basketType) {
    dispatch(addProductUnsafe(product));
    if (router) {
      router.history.push({ pathname: '/basket' });
    }
  }
  else {
    const confirmCallback = () => {
      dispatch(clear());
      dispatch(addProductUnsafe(product));
      dispatch(popup.close());
      dispatch(message.show('Added to basket'));
      if (router) {
        router.history.push({ pathname: '/basket' });
      }
    };
    const cancelCallback = () => {
      dispatch(popup.close());
    };
    const body = (<ConfirmChangeProduct
      confirmCallback={confirmCallback}
      cancelCallback={cancelCallback}
      product={product}
    />);
    dispatch(popup.open('Confirm to clear basket', body));
  }
};

/**
 * Same as addProduct but with redirect.
 */
export const addProductWithRedirect = (product, router) => (dispatch, getState) => {
  addProduct(product, router)(dispatch, getState);
};

export const addCustomPriceProduct = (product, amount, router) => (dispatch, getState) => {
  const basketType = getState().basket.type;

  if (product.type === basketType || !basketType) {
    dispatch(addCustomPriceProductUnsafe(product, amount));
    if (router) {
      router.history.push({ pathname: '/basket' });
    }
  }
  else {
    const confirmCallback = () => {
      dispatch(clear());
      dispatch(addCustomPriceProductUnsafe(product, amount));
      dispatch(popup.close());
      if (router) {
        router.history.push({ pathname: '/basket' });
      }
    };
    const cancelCallback = () => {
      dispatch(popup.close());
    };
    const body = (<ConfirmChangeProduct
      confirmCallback={confirmCallback}
      cancelCallback={cancelCallback}
      product={product}
    />);
    dispatch(popup.open('Confirm to clear basket', body));
  }
};
