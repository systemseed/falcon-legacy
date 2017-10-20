import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { LOCATION_CHANGE } from 'react-router-redux';
import { gifts, giftsFilter, giftCustomPrice } from './gifts';
import { giftsCorporate, giftCorporateCustomPrice } from './gifts.corporate';
import { currentCurrency } from './currencies';
import { contactForm } from './contact';
import { messageBar } from './messageBar';
import { featuredImages } from './featuredImages';
import { basicPage } from './basicPage';
import { siteContentSettings } from './siteContentSettings';
import { customPageMetatags } from './customPageMetatags';
import authentication from './authentication';
import admin from './admin';
import basket from './basket';
import checkout from './checkout';
import { popup } from './popup';
import eventcodes from './eventcodes';

// This flag is used by ProductAdminContainer to properly display Loading / 403 messages.
const isPersistentReady = (state = false, action) => {
  switch (action.type) {
    case 'persist/REHYDRATE':
      return true;
    default:
      return state;
  }
};

// THIS IS AN ANTI-PATTERN.
// TODO: find out a way to trigger a function on route change.
const routerChanged = (state = {}, action) => {
  if (action.type === LOCATION_CHANGE) {
    if (typeof window !== 'undefined' && window.cw_vwo_executeTrackingCode) { // eslint-disable-line no-undef
      window.cw_vwo_executeTrackingCode(); // eslint-disable-line no-undef
    }
  }

  // Always return the same state. We don't really use redux store.
  return {};
};

export default combineReducers({
  admin,
  auth: authentication,
  basket,
  basicPage,
  customPageMetatags,
  checkout,
  contactForm,
  currentCurrency,
  eventcodes,
  featuredImages,
  gifts,
  giftsFilter,
  giftsCorporate,
  giftCustomPrice,
  giftCorporateCustomPrice,
  isPersistentReady,
  messageBar,
  siteContentSettings,
  popup,
  router: routerReducer,
  routerChanged
});
