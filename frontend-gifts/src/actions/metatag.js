import request from 'superagent';
import jsonapify from 'superagent-jsonapify';
import config from '../config';

jsonapify(request);

/**
 * Dispatches request to fetch all custom page metatags.
 */
export function getCustomPageMetatags() {
  return {
    type: `GET_CUSTOM_PAGE_METATAGS`,
    payload: request
      .get(`${config.backend}/v1/gifts/jsonapi/metatag_defaults/metatag_defaults`)
  };
}
