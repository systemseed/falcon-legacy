import request from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';
import config from '../config';
import * as giftUtils from '../utils/gifts';

// Add support of JSON API.
superagentJsonapify(request);

/**
 * @file Functions with async calls to the backend.
 *
 * TODO: MOVE ALL THIS STUFF TO ACTIONS WITH PROMISES AS PAYLOAD!!!
 */

/**
 * @public
 * Fetch OAuth Token from backend.
 *
 * TODO: rewrite with Promises.
 *
 * @param {string} application - backend to authenticate.
 * @param {object} credentials with username and password keys.
 * @param {onSuccess} onSuccess callback.
 * @param {onError} onError callback.
 *
 * @returns {void}
 */
const postOAuthToken = (application, credentials, onSuccess, onError) => {
  // Make request to backend to auth.
  request
    // Do a post request.
    .post(`${config.backend}/v1/${application}/oauth/token`)
    .type('form')
    // Set fields to send to backend.
    .send({ 'username': credentials.username })
    .send({ 'password': credentials.password })
    .end((err, res) => {
      if (err) {
        if (onError === undefined) {
          console.log(err);
        }
        else {
          onError(err);
        }
      }
      else if (res.statusCode === 200 && res.body && res.body) {
        onSuccess(res.body);
      }
    });
};

/**
 * @public
 * Returns thenable request for data model.
 * NOTE: data-model is not in use at the moment.
 *
 * @param { string } backend - API backend (donations or gifts).
 * @param { string } entity - Entity for which schema is requested.
 * @param { string } bundle - Optional entity bundle.
 *
 * @returns {Promise} Promise
 */
const getDataModel = (backend, entity, bundle) => new Promise((resolve, reject) => {
  let url = `${config.backend}/v1/${backend}/data-model/${entity}`;
  if (bundle) {
    url += `/${bundle}`;
  }
  request
    .get(url)
    .end((err, res) => {
      if (err) {
        reject(err);
      }
      else if (res.statusCode === 200 && res.body) {
        resolve(res.body);
      }
      else {
        reject('No body set');
      }
    });
});

/**
 * TODO: refactor with redux-promise-middleware.
 *
 * @public
 * Get gift card configurations for the product.
 *
 * @param {string} productId
 * @param {string} onlyType
 *   Return promise for specified config only, physical or email.
 */
const getProductCardConfigs = (productId, onlyType = false) => {
  const promisePhysical = new Promise((resolve, reject) => {
    const type = 'physical';
    request
      .get(`${config.backend}/v1/gifts/jsonapi/gift_card_config/${type}`)
      .query({
        // Filter by product id.
        'filter[donations_product_uuid][value]': productId,
        // Include referenced image.
        'include': 'field_image,field_image.field_image',
        // Get necessary data only.
        'fields[gift_card_config--physical]': 'uuid,field_image',
        'fields[media--gift_cards]': 'field_image',
        'fields[file--file]': 'url',
        // There should be only one gift card configuration item per product.
        'page[limit]': 1
      })
      .end((err, res) => {
        if (err) {
          reject(err);
        }
        else if (res.statusCode === 200 && res.body && res.body.data) {
          if (res.body.data.length) {
            resolve({ type, card: res.body.data[0] });
          }
          else {
            // Request is successful but this type of card doesn't exist for this product.
            resolve({ type, card: false });
          }
        }
        else {
          reject('No data set');
        }
      });
  });

  if (onlyType === 'physical') {
    return promisePhysical;
  }

  const promiseEmail = new Promise((resolve, reject) => {
    const type = 'email';
    request
      .get(`${config.backend}/v1/gifts/jsonapi/gift_card_config/${type}`)
      .query({
        // Filter by product id.
        'filter[donations_product_uuid][value]': productId,
        // Include referenced image.
        'include': 'field_image,field_image.field_image',
        // Get necessary data only.
        'fields[gift_card_config--email]': 'uuid,donations_product_uuid,field_intro_text,field_card_message,field_image',
        'fields[media--gift_cards]': 'field_image',
        'fields[file--file]': 'url',
        // There should be only one gift card configuration item per product.
        'page[limit]': 1
      })
      .end((err, res) => {
        if (err) {
          reject(err);
        }
        else if (res.statusCode === 200 && res.body && res.body.data) {
          if (res.body.data.length) {
            resolve({ type, card: res.body.data[0] });
          }
          else {
            // Request is successful but this type of card doesn't exist for this product.
            resolve({ type, card: false });
          }
        }
        else {
          reject('No data set');
        }
      });
  });

  if (onlyType === 'email') {
    return promiseEmail;
  }

  return Promise.all([promisePhysical, promiseEmail]);
};

/**
 * TODO: refactor with redux-promise-middleware.
 *
 * @public
 * Post gift cards.
 *
 * @param {object} card
 */
const postEmailCard = (card, attributes) => {
  const data = {
    'data': {
      type: 'ecard_item--gift',
      attributes
    }
  };

  return request.post(`${config.backend}/v1/gifts/jsonapi/ecard_item/gift`)
    .set('Content-Type', 'application/vnd.api+json')
    .send(data);
};


const getEcardItem = async (cardId) => {
  const { body } = await request
    .get(`${config.backend}/v1/gifts/jsonapi/ecard_item/gift/${cardId}`);

  return body.data;
};


// TODO: rework image handling.
const getImageUrl = (type, imageField, imageStyle) => {
  if (!imageField || !imageField.url) {
    return false;
  }

  // Note: default JSON API file urls are relative.
  const defaultUrl = `${config[type]}${imageField.url}`;

  // Return default field image if no image style requested.
  if (!imageStyle) {
    return defaultUrl;
  }
  //  Return default field image if requested image style not found.
  if (!imageField.meta || !imageField.meta.derivatives || !imageField.meta.derivatives[imageStyle]) {
    return defaultUrl;
  }

  // Note: derivatives expose absolute URLs.
  return imageField.meta.derivatives[imageStyle];
};

const getImageAlt = (relationship, defaultAlt = '') => {
  // In some cases relationship data / meta can be empty.
  if (relationship.data && relationship.data.meta) {
    return relationship.data.meta.alt;
  }

  return defaultAlt;
};


const getProduct = async (type, productId) => {
  const { body } = await request
    .get(`${config.backend}/v1/donations/jsonapi/commerce_product/${type}/${productId}`)
    .query({
      'include': 'variations,field_gift_category,field_gift_image',
      'fields[commerce_product_variation--gift]': 'variation_id,sku,price',
      'fields[taxonomy_term--gift_category]': 'id,name',
      'fields[file--file]': 'url'
    });

  return giftUtils.mappedProductItem(body.data);
};


// todo: Use named exports, this cluters the name space and injects more code than needs to be.
export default {
  postOAuthToken,
  getDataModel,
  getProductCardConfigs,
  postEmailCard,
  getEcardItem,
  getImageUrl,
  getImageAlt,
  getProduct
};
