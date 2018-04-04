import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import { mappedProductItem } from '../utils/gifts';

export const gifts = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  products: [],
  categories: []
}, action) => {
  switch (action.type) {

    case 'GET_PRODUCTS_GIFT_PENDING':
      return {
        ...state,
        isPending: true
      };

    case 'GET_PRODUCTS_GIFT_FULFILLED': {
      const products = action.payload.body.data;
      const mappedProducts = [];
      const categories = [];

      products.forEach((item) => {
        const customPriceProduct = item.fieldGiftVariantType === 'custom_price';

        // Filter out gifts without price.
        if (customPriceProduct) {
          return;
        }

        // Prepare product object and add to products collection.
        mappedProducts.push(mappedProductItem(item));

        // Add category to the list of available categories.
        if (item.fieldGiftCategory !== undefined) {
          const categoryAdded = _find(categories, category => category.id === item.fieldGiftCategory.id);

          if (!categoryAdded) {
            categories.push({
              id: item.fieldGiftCategory.id,
              name: item.fieldGiftCategory.name,
              path: item.fieldGiftCategory.fieldFieldablePath,
              metatags: item.fieldGiftCategory.fieldMetatags
            });
          }
        }
      });

      return {
        ...state,
        isPending: false,
        isFulfilled: true,
        products: mappedProducts,
        categories,
      };
    }
    case 'GET_PRODUCTS_GIFT_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };

    default:
      return state;
  }
};

export const giftCustomPrice = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  product: {},
}, action) => {
  switch (action.type) {

    case 'GET_CUSTOM_PRICE_GIFT_PENDING':
      return {
        ...state,
        isPending: true,
      };

    case 'GET_CUSTOM_PRICE_GIFT_FULFILLED': {
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
    }
    case 'GET_CUSTOM_PRICE_GIFT_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };

    default:
      return state;
  }
};
