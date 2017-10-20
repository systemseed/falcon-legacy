import { LOCATION_CHANGE } from 'react-router-redux';
import * as events from './event-definitions';

export default {
  [LOCATION_CHANGE]: events.pageView,
  'ANALYTICS_ECOMMERCE_DETAIL': events.ecommerceDetail,
  'BASKET_ADD_PRODUCT': events.ecommerceAdd,
  'BASKET_ADD_CUSTOM_PRICE_PRODUCT': events.ecommerceAdd,
  'ANALYTICS_ECOMMERCE_CHECKOUT': events.ecommerceCheckout,
  'ANALYTICS_ECOMMERCE_PURCHASE': events.ecommercePurchase
};
