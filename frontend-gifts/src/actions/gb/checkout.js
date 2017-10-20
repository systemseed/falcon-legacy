import request from 'superagent';
import jsonapify from 'superagent-jsonapify';
import * as checkoutUtils from '../../utils/checkout';
import { postCheckout } from '../checkout';

jsonapify(request);

// Based on ../ie/checkout.js, added values from ...forms.giftaid.formData to order_fields property.
// Prepare all checkout data for postCheckout action.
export const placeOrder = payment => (dispatch, getState) => {
  const currency = getState().currentCurrency;
  const orderItems = checkoutUtils.getOrderItems(getState());
  const forms = getState().checkout.form;

  const data = {
    profile: {
      ...forms.profile.formData,
      ...forms.optins.formData,
      field_profile_address: forms.address.formData,
      email: forms.profile.formData.field_profile_email
    },
    order_fields: { ...forms.eventcode.formData, ...forms.giftaid.formData },
    order_items: orderItems,
    payment: {
      ...payment,
      currency
    }
  };

  dispatch(postCheckout(data));
};
