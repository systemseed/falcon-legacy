import request from 'superagent';
import jsonapify from 'superagent-jsonapify';
import config from '../config';

jsonapify(request);

const defaultQueryParams = {
  // Fetch extra data in the same request.
  'include': 'variations,field_gift_category,field_gift_image,field_gift_action_image,field_fieldable_path,field_gift_product_code,field_metatags,field_gift_description_image,field_gift_what_you_get_image,field_gifts_in_bundle,field_gift_postal_preview_body,field_gift_ecard_preview_body,field_gift_postal_preview_image,field_gift_ecard_preview_image',
  // Limit variation fields to this list.
  'fields[commerce_product_variation--gift]': 'variation_id,sku,price',
  // Limit taxonomy term fields to this list.
  'fields[taxonomy_term--gift_category]': 'id,name,field_fieldable_path,field_metatags',
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
