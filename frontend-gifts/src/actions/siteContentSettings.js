import request from 'superagent';
import jsonapify from 'superagent-jsonapify';
import config from '../config';

jsonapify(request);

export const load = () => ({
  type: 'GET_SITE_CONTENT_SETTINGS',
  payload: request
    .get(`${config.backend}/v1/gifts/jsonapi/config_pages/site_content_settings`)
});
