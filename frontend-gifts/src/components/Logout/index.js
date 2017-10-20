import React, { Component, PropTypes } from 'react';

class Logout extends Component {

  render() {
    const { onLogoutClick } = this.props;

    return (
      <button onClick={() => onLogoutClick()}>
        Logout
      </button>
    );
  }
}

Logout.propTypes = {
  onLogoutClick: PropTypes.func.isRequired
};

export default Logout;
