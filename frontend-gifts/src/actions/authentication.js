import api from '../lib/api';

export const requestLogin = credentials => ({
  type: 'LOGIN_REQUEST',
  credentials
});

export const receiveLogin = tokens => ({
  type: 'LOGIN_SUCCESS',
  tokens
});

export const loginError = errorMessage => ({
  type: 'LOGIN_FAILURE',
  errorMessage
});

export const receiveLogout = () => ({
  type: 'LOGOUT_SUCCESS',
});

// Async action creator (dispatcher).
// TODO: rework with promises to get rid of callback hell.
export const loginUser = creds => (dispatch) => {
  const onLoginError = () => {
    dispatch(loginError('Sorry, unrecognized username or password.'));
  };
  // We dispatch requestLogin to kickoff the call to the API.
  dispatch(requestLogin());

  // First, fetch token from donations.
  api.postOAuthToken('donations', creds, (donationsResponse) => {
    // On success, fetch token from gifts.
    api.postOAuthToken('gifts', creds, (giftsResponse) => {
      // On success, save both tokens to store.
      const tokens = {
        'donations': donationsResponse.access_token,
        'gifts': giftsResponse.access_token
      };
      // Dispatch the success action.
      dispatch(receiveLogin(tokens));
    },
    onLoginError);
  },
  onLoginError);
};

// Async action creator (dispatcher).
export const logoutUser = () => (dispatch) => {
  dispatch(receiveLogout());
};
