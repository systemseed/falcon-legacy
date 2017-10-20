import _isEmpty from 'lodash/isEmpty';
import { mappedProductItem } from '../utils/gifts.corporate';

export const giftsCorporate = (state = {
  isPending: false,
  isFulfilled: false,
  isRejected: false,
  products: []
}, action) => {
  switch (action.type) {

    case 'GET_PRODUCTS_GIFT_CORPORATE_PENDING':
      return {
        ...state,
        isPending: true,
      };

    case 'GET_PRODUCTS_GIFT_CORPORATE_FULFILLED':

      const products = action.payload.body.data;
      const mappedProducts = [];

      products.forEach((item) => {
        let price = {};
        const customPriceProduct = item.fieldGiftVariantType === 'custom_price';

        // Filter out gifts without price.
        if (customPriceProduct) {
          price = {
            amount: 0,
          };
        }
        else {
          item.variations.forEach((variation) => {
            price[variation.price.currency_code] = {
              amount: variation.price.number,
              currency: variation.price.currency_code
            };
          });
        }

        // Prepare product object and add to products collection.
        mappedProducts.push(mappedProductItem(item));
      });

      return {
        ...state,
        isPending: false,
        isFulfilled: true,
        products: mappedProducts,
      };

    case 'GET_PRODUCTS_GIFT_CORPORATE_REJECTED':
      return {
        ...state,
        isPending: false,
        isRejected: true,
      };

    case 'PATCH_PRODUCT_GIFT_FULFILLED':
      const product = mappedProductItem(action.payload.body.data);
      const foundIndex = state.products.findIndex(item => item.id === product.id);

      return {
        ...state,
        products: [
          ...state.products.slice(0, foundIndex),
          product,
          ...state.products.slice(foundIndex + 1)
        ]
      };
    default:
      return state;
  }
};

export const giftCorporateCustomPrice = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  product: {},
}, action) => {
  switch (action.type) {

    case 'GET_CUSTOM_PRICE_GIFT_CORPORATE_PENDING':
      return {
        ...state,
        isPending: true,
      };

    case 'GET_CUSTOM_PRICE_GIFT_CORPORATE_FULFILLED':

      const product = action.payload.body.data[0];
      if (_isEmpty(product)) {
        return {
          ...state,
          isPending: false,
          isError: true,
        };
      }

      return {
        ...state,
        isPending: false,
        isFulfilled: true,
        product: mappedProductItem(product)
      };

    case 'GET_CUSTOM_PRICE_GIFT_CORPORATE_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };

    default:
      return state;
  }
};
