// TODO: get roles from backend. Currently TRUE for any authenticated user.
export const userHasRole = (state, role) =>
   state.auth.isAuthenticated;

// Get access token for authenticated requests.
export const getAccessToken = (state, backend) =>
  state.auth.tokens[backend];
