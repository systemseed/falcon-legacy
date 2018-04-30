import request from 'superagent';
import jsonapify from 'superagent-jsonapify';
import config from '../config';

jsonapify(request);

export function loadAll() {
  return {
    type: 'GET_REDIRECTS',
    payload: request
      .get(`${config.backend}/v1/gifts/jsonapi/redirect/redirect`)
      .query({
        'fields[redirect--redirect]': 'uuid,redirect_source,status_code,redirect_url'
      })
  };
}
