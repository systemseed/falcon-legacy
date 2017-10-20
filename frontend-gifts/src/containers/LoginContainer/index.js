import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Login from '../../components/Login';
import Logout from '../../components/Logout';
import { loginUser, logoutUser } from '../../actions/authentication';

const LoginContainer = ({ isAuthenticated, isFetching, errorMessage, dispatch }) => (
  <div className="login">
    {isFetching &&
    <div>Loading...</div>
    }
    {!isAuthenticated &&
    <Login
      errorMessage={errorMessage}
      onLoginClick={credentials => dispatch(loginUser(credentials))}
    />
    }

    {isAuthenticated &&
    <Logout onLogoutClick={() => dispatch(logoutUser())} />
    }
  </div>
);

LoginContainer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

LoginContainer.defaultProps = {
  errorMessage: '',
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isFetching: state.auth.isFetching,
  errorMessage: state.auth.errorMessage
});

export default connect(mapStateToProps)(LoginContainer);
