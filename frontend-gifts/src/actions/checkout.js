import request from 'superagent';
import jsonapify from 'superagent-jsonapify';
import config from '../config';
import * as regionUtils from '../utils/region';
import * as checkoutGB from './gb/checkout';
import * as checkoutIE from './ie/checkout';

jsonapify(request);

export const checkoutPaymentComplete = data => ({
  type: 'CHECKOUT_PAYMENT_COMPLETE',
  order_id: data.order_id,
  order_uuid: data.order_uuid,
  order_status: data.order_status
});

export const checkoutComplete = () => ({
  type: 'CHECKOUT_COMPLETE'
});

export const formChanged = (formName, formData, validated) => ({
  type: 'CHECKOUT_FORM_CHANGED',
  formName,
  formData,
  validated
});

export const reset = () => ({
  type: 'CHECKOUT_FORM_RESET',
});

export const checkoutCardsInit = (basketType, cardItems) => ({
  type: 'CHECKOUT_CARD_INIT',
  basketType,
  cardItems
});

export const checkoutCardTypeChanged = (cardIndex, cardType) => ({
  type: 'CHECKOUT_CARD_TYPE_CHANGED',
  cardIndex,
  cardType
});

export const checkoutCardEmailFormChanged = (cardIndex, emailFormData, validated) => ({
  type: 'CHECKOUT_CARD_EMAIL_FORM_CHANGED',
  cardIndex,
  emailFormData,
  validated
});

export const checkoutCardsSending = () => ({
  type: 'CHECKOUT_CARDS_SENDING'
});

export const checkoutCardsSent = () => ({
  type: 'CHECKOUT_CARDS_SENT'
});

// TODO: move to separate file.
export const loadProductCardConfigs = (productIds) => {
  let type = 'physical';
  const promisePhysical = request
      .get(`${config.backend}/v1/gifts/jsonapi/gift_card_config/${type}`)
      .query({
        // Filter by product ids.
        'filter[product-ids][condition][path]': 'donations_product_uuid',
        'filter[product-ids][condition][value][]': productIds,
        'filter[product-ids][condition][operator]': 'IN',
        'include': 'field_image,field_image.field_image',
        'fields[gift_card_config--physical]': 'uuid,donations_product_uuid,field_image',
        'fields[media--gift_cards]': 'field_image',
        'fields[file--file]': 'url'
      });

  type = 'email';
  const promiseEmail = request
      .get(`${config.backend}/v1/gifts/jsonapi/gift_card_config/${type}`)
      .query({
        // Filter by product ids.
        'filter[product-ids][condition][path]': 'donations_product_uuid',
        'filter[product-ids][condition][value][]': productIds,
        'filter[product-ids][condition][operator]': 'IN',
        'include': 'field_image,field_image.field_image,donation_product_uuid',
        'fields[gift_card_config--email]': 'uuid,donations_product_uuid,field_intro_text,field_card_message,field_image',
        'fields[media--gift_cards]': 'field_image',
        'fields[file--file]': 'url',
      });

  return {
    type: 'GET_CHECKOUT_CARD_CONFIGS',
    payload: Promise.all([promisePhysical, promiseEmail])
  };
};

export const showErrors = () => ({
  type: 'CHECKOUT_SHOW_ERRORS'
});

export const hideErrors = () => ({
  type: 'CHECKOUT_HIDE_ERRORS'
});

export const getPaymentMethods = () => ({
  type: 'GET_PAYMENT_METHODS',
  payload: request
  .get(`${config.backend}/v1/donations/jsonapi/commerce_payment_gateway/commerce_payment_gateway`)
  .query({
    'filter[status][value]': '1',
    'filter[id-filter][condition][path]': 'id',
    'filter[id-filter][condition][operator]': 'CONTAINS',
    'filter[id-filter][condition][value]': `gifts_${config.mode}_`
  })
});

export const postCheckout = data => ({
  type: 'POST_CHECKOUT',
  payload: request
    .post(`${config.backend}/v1/donations/cw/checkout/gifts?_format=json`)
    .set('Content-Type', 'application/json')
    .send(data)
});

// Prepare all checkout data for postCheckout action.
export const placeOrder = payment => {

  return regionUtils.isRegionGB() ? checkoutGB.placeOrder(payment) : checkoutIE.placeOrder(payment);
};
