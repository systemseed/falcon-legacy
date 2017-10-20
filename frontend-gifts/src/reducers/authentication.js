// The auth reducer. The starting state sets authentication
// based on a token being in persistent storage.
const authentication = (state = {
  isFetching: false,
  isAuthenticated: false,
  tokens: {}
}, action) => {
  switch (action.type) {

    case 'LOGIN_REQUEST':
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        tokens: action.tokens,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: ''
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message
      };

    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        tokens: {},
        isFetching: false,
        isAuthenticated: false
      };

    default:
      return state;
  }
};

export default authentication;
