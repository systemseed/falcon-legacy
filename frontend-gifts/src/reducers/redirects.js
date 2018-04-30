export const redirects = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  list: []
}, action) => {
  switch (action.type) {

    case 'GET_REDIRECTS_PENDING':
      return {
        ...state,
        isPending: true,
      };

    case 'GET_REDIRECTS_FULFILLED': {
      const data = action.payload.body.data;
      const list = [];

      // Prepare redirects data.
      data.forEach((item) => {
        list.push(
          {
            source_path: `/${item.attributes.redirect_source.path.replace(/\/+$/, '')}`,
            redirect_url: item.attributes.redirect_url
          }
        );
      });

      return {
        ...state,
        isPending: false,
        isFulfilled: true,
        list
      };
    }

    case 'GET_REDIRECTS_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };

    default:
      return state;
  }
};
