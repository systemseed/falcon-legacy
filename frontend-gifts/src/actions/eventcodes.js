import request from 'superagent';
import jsonapify from 'superagent-jsonapify';
import config from '../config';

jsonapify(request);

export const getAll = () => ({
  type: 'GET_EVENT_CODES',
  payload: request
  .get(`${config.backend}/v1/donations/jsonapi/event_code/event_code`)
  .query({
    'fields[event_code--event_code]': 'id,uuid,label',
    'filter[status][value]': 1
  })
});
