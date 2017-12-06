import { mappedProductItem } from '../utils/gifts.free';

export const giftsFree = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  products: [],
}, action) => {
  switch (action.type) {

    case 'GET_PRODUCTS_GIFT_FREE_PENDING':
      return {
        ...state,
        isPending: true
      };

    case 'GET_PRODUCTS_GIFT_FREE_FULFILLED':

      const products = action.payload.body.data;
      const mappedProducts = [];

      products.forEach((item) => {
        // Prepare product object and add to products collection.
        mappedProducts.push(mappedProductItem(item));
      });

      return {
        ...state,
        isPending: false,
        isFulfilled: true,
        products: mappedProducts,
      };

    case 'GET_PRODUCTS_GIFT_FREE_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };

    default:
      return state;
  }
};
