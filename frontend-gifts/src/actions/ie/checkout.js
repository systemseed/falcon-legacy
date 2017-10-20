import request from 'superagent';
import jsonapify from 'superagent-jsonapify';
import * as checkoutUtils from '../../utils/checkout';
import { postCheckout } from '../checkout';

jsonapify(request);

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
    order_fields: forms.eventcode.formData,
    order_items: orderItems,
    payment: {
      ...payment,
      currency
    }
  };

  dispatch(postCheckout(data));
};
