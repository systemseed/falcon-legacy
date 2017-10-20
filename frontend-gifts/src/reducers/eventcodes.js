
const eventcodes = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  codes: [],
  labels: []
}, action) => {
  switch (action.type) {

    case 'GET_EVENT_CODES_PENDING':
      return {
        ...state,
        isPending: true
      };

    case 'GET_EVENT_CODES_FULFILLED':
      return {
        codes: action.payload.body.data.map(item => item.id),
        labels: action.payload.body.data.map(item => item.label),
        isPending: false,
        isError: false,
        isFulfilled: true
      };
    case 'GET_EVENT_CODES_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };
    default:

      return state;
  }
};

export default eventcodes;
