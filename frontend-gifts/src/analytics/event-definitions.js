import * as basketUtils from '../utils/basket';

export const pageView = {
  eventFields: action => ({
    hitType: 'pageview',
    page: action.payload
  }),
};

// Integration with Enhanced Ecommerce.
// See more: https://developers.google.com/tag-manager/enhanced-ecommerce#details

export const ecommerceDetail = {
  eventFields: action => ({
    event: 'ecommerceDetail',
    ecommerce: {
      detail: {
        products: [{
          name: action.product.title,
          id: action.product.code
        }]
      }
    }
  })
};

export const ecommerceAdd = {
  eventFields: (action, state) => ({
    event: 'ecommerceAdd',
    ecommerce: {
      currencyCode: state.currentCurrency,
      add: {
        products: [{
          name: action.product.title,
          id: action.product.code,
          price: action.amount ? action.amount : action.product.price[state.currentCurrency].amount,
          // Quantity is always 1 per action.
          quantity: 1
        }]
      }
    }
  })
};

export const ecommerceCheckout = {
  eventFields: (action, state) => ({
    event: 'ecommerceCheckout',
    ecommerce: {
      currencyCode: state.currentCurrency,
      checkout: {
        products: state.basket.products.map(product => ({
          name: product.data.title,
          id: product.data.code,
          price: basketUtils.getProductPrice(product, state.currentCurrency),
          quantity: basketUtils.getProductQuantity(product)
        }))
      }
    }
  })
};

export const ecommercePurchase = {
  eventFields: (action, state) => ({
    event: 'ecommercePurchase',
    ecommerce: {
      currencyCode: state.currentCurrency,
      purchase: {
        actionField: {
          id: state.checkout.order.order_id,
          revenue: basketUtils.getTotal(state.basket.products, state.currentCurrency)
        },
        products: state.basket.products.map(product => ({
          name: product.data.title,
          id: product.data.code,
          price: basketUtils.getProductPrice(product, state.currentCurrency),
          quantity: basketUtils.getProductQuantity(product)
        }))
      }
    }
  })
};
