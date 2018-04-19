import request from 'superagent';
import jsonapify from 'superagent-jsonapify';
import config from '../config';

jsonapify(request);

export function loadAll() {
  return {
    type: 'GET_MENU',
    payload: request
      .get(`${config.backend}/v1/gifts/jsonapi/menu_link_content/menu_link_content`)
      .query({
        'fields[menu_link_content--menu_link_content]': 'uuid,title,url',
        'filter[menu_name][condition][path]': 'menu_name',
        'filter[menu_name][condition][value]': 'main',
        'filter[enabled][condition][path]': 'enabled',
        'filter[enabled][condition][value]': 1,
        'sort': 'title,weight'
      })
  };
}
