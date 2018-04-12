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
        if (page.attributes.body && page.attributes.body.value) {
          // Add Gifts domain to all image urls.
          page.attributes.body.value = pageUtils.processImages(page.attributes.body.value);
        }

        if (page.relationships.field_featured_image && page.relationships.field_featured_image.data) {
          page.attributes.field_featured_image = page.relationships.field_featured_image.data.id;
        }

        list.push(page.attributes);
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
