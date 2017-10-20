export const customPageMetatags = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  metatags: []
}, action) => {
  switch (action.type) {

    case 'GET_CUSTOM_PAGE_METATAGS_PENDING':
      return {
        ...state,
        isPending: true,
      };

    case 'GET_CUSTOM_PAGE_METATAGS_FULFILLED':
      return {
        ...state,
        isPending: false,
        isFulfilled: true,
        metatags: action.payload.body.data,
      };

    case 'GET_CUSTOM_PAGE_METATAGS_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };

    default:
      return state;
  }
};
