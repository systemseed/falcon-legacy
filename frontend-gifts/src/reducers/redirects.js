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

      data.forEach((item) => {
        list.push(item.attributes);
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
