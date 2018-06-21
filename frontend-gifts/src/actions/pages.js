import request from 'superagent';
import jsonapify from 'superagent-jsonapify';
import config from '../config';

jsonapify(request);

export function loadAll() {
  return {
    type: 'GET_PAGES',
    payload: request
      .get(`${config.backend}/v1/gifts/jsonapi/node/cw_page`)
      .query({
        'filter[status][value]': 1,
        'fields[node--cw_page]': 'uuid,title,body,field_metatags,field_fieldable_path,field_featured_image,field_paragraph_blocks'
      })
  };
}
