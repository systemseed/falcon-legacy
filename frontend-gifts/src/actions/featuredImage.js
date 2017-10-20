import request from 'superagent';
import jsonapify from 'superagent-jsonapify';
import config from '../config';

jsonapify(request);

export const fetchAll = () => ({
  type: 'FEATURED_IMAGES_FETCH',
  payload: request
    .get(`${config.backend}/v1/gifts/jsonapi/featured_image/image`)
    .query({
      'include': 'field_featured_image',
      'fields[file--file]': 'url',
    })
});
