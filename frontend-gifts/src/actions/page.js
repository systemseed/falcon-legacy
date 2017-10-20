import request from 'superagent';
import jsonapify from 'superagent-jsonapify';
import config from '../config';

jsonapify(request);

export const load = uuid => ({
  type: 'GET_PAGE',
  payload: request
    .get(`${config.backend}/v1/gifts/jsonapi/node/cw_page/${uuid}`)
    .query({
      'fields[node--cw_page]': 'uuid,title,body,field_metatags'
    })
});
