export const siteContentSettings = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  data: {}
}, action) => {
  switch (action.type) {

    case 'GET_SITE_CONTENT_SETTINGS_PENDING':
      return {
        ...state,
        isPending: true,
      };

    case 'GET_SITE_CONTENT_SETTINGS_FULFILLED':
      return {
        ...state,
        isPending: false,
        isFulfilled: true,
        data: action.payload.body.data[0],
      };

    case 'GET_SITE_CONTENT_SETTINGS_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };

    default:
      return state;
  }
};
