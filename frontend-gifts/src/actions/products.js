import request from 'superagent';
import jsonapify from 'superagent-jsonapify';
import config from '../config';
import { editGiftForm } from './admin';

jsonapify(request);

const defaultQueryParams = {
  // Fetch extra data in the same request.
  'include': 'variations,field_gift_category,field_gift_image,field_gift_action_image,field_fieldable_path,field_gift_product_code,field_metatags,field_gift_description_image,field_gift_what_you_get_image,field_gifts_in_bundle',
  // Limit variation fields to this list.
  'fields[commerce_product_variation--gift]': 'variation_id,sku,price',
  // Limit taxonomy term fields to this list.
  'fields[taxonomy_term--gift_category]': 'id,name',
  'fields[file--file]': 'url',
  'filter[status][value]': 1,
  // Sorting works this way: "order by variant price ASC".
  'sort[sort-price][path]': 'variations.price.number',
};

/**
 * Dispatches request to fetch all products of a certain
 * bundle.
 *
 * @param productBundle
 *   'gift' or 'gift_corporate'
 */
export function getAll(productBundle) {
  return {
    type: `GET_PRODUCTS_${productBundle.toUpperCase()}`,
    payload: request
      .get(`${config.backend}/v1/donations/jsonapi/commerce_product/${productBundle}`)
      .query(defaultQueryParams)
  };
}

export function getCustomPriceProduct(productBundle) {
  return {
    type: `GET_CUSTOM_PRICE_${productBundle.toUpperCase()}`,
    payload: request
      .get(`${config.backend}/v1/donations/jsonapi/commerce_product/${productBundle}`)
      .query({
        ...defaultQueryParams,
        'filter[field_gift_variant_type][value]': 'custom_price'
      })
  };
}

export const updateUnsafe = (accessToken, product, data) => ({
  type: `PATCH_PRODUCT_${product.type.toUpperCase()}`,
  payload: request
    .patch(`${config.backend}/v1/donations/jsonapi/commerce_product/${product.type}/${product.id}`)
    .set('Content-Type', 'application/vnd.api+json')
    .set('Authorization', `Bearer ${accessToken}`)
    .query(defaultQueryParams)
    .send(data)
});

export const update = (product, formData) => (dispatch, getState) => {
  // Grab appropriate auth token from store.
  const accessToken = getState().auth.tokens.donations;

  const relationships = {
    field_gift_category: {
      data: {
        type: 'taxonomy_term--gift_category',
        id: formData.category_id
      }
    }
  };

  const attributes = { ...formData };
  // Remove virtual fields.
  delete attributes.category_id;

  const data = {
    'data': {
      type: `commerce_product--${product.type}`,
      id: product.id,
      attributes,
      relationships
    }
  };

  dispatch(editGiftForm(formData));
  dispatch(updateUnsafe(accessToken, product, data));
};
