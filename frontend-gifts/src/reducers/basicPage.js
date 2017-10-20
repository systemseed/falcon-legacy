import _find from 'lodash/find';
import * as pageUtils from '../utils/page';

export const basicPage = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  list: []
}, action) => {
  let page;
  switch (action.type) {

    case 'GET_PAGE_PENDING':
      return {
        ...state,
        isPending: true,
      };

    case 'GET_PAGE_FULFILLED':

      page = action.payload.body.data;
      if (!_find(state.list, { uuid: page.attributes.uuid })) {
        if (page.attributes.body && page.attributes.body.value) {
          // Add Gifts domain to all image urls.
          page.attributes.body.value = pageUtils.processImages(page.attributes.body.value);
        }
        return {
          ...state,
          isPending: false,
          isFulfilled: true,
          list: [
            ...state.list,
            page.attributes
          ]
        };
      }

      return {
        ...state,
        isPending: false,
        isFulfilled: true,
      };

    case 'GET_PAGE_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };

    default:
      return state;
  }
};
