import * as pageUtils from '../utils/page';

export const pages = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  list: []
}, action) => {
  switch (action.type) {

    case 'GET_PAGES_PENDING':
      return {
        ...state,
        isPending: true,
      };

    case 'GET_PAGES_FULFILLED': {
      const data = action.payload.body.data;
      const list = [];

      data.forEach((page) => {
        list.push(pageUtils.mappedPageItem(page));
      });

      return {
        ...state,
        isPending: false,
        isFulfilled: true,
        list
      };
    }

    case 'GET_PAGES_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };

    default:
      return state;
  }
};
