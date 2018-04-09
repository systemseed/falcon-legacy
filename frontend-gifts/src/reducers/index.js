import { combineReducers } from 'redux';
import { routerReducer, LOCATION_CHANGE } from 'react-router-redux';
import { gifts, giftCustomPrice } from './gifts';
import { giftsCorporate, giftCorporateCustomPrice } from './gifts.corporate';
import { giftsFree } from './gifts.free';
import { currentCurrency } from './currencies';
import { contactForm } from './contact';
import { messageBar } from './messageBar';
import { featuredImages } from './featuredImages';
import { pages } from './pages';
import { siteContentSettings } from './siteContentSettings';
import { customPageMetatags } from './customPageMetatags';
import basket from './basket';
import cards from './cards';
import checkout from './checkout';
import { popup } from './popup';
import eventcodes from './eventcodes';

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
  app: (state = {}) => state,
  basket,
  pages,
  cards,
  customPageMetatags,
  checkout,
  contactForm,
  currentCurrency,
  eventcodes,
  featuredImages,
  gifts,
  giftsCorporate,
  giftsFree,
  giftCustomPrice,
  giftCorporateCustomPrice,
  messageBar,
  siteContentSettings,
  popup,
  router: routerReducer,
  routerChanged
});
