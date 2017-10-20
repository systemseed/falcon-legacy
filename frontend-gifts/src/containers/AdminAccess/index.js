import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { userHasRole } from '../../utils/authentication';

// AdminAccess component renders its content only if a user has a specified role.
// TODO: check in 'react-tips' how this class of components is called? Proxy?
const AdminAccess = ({ isAllowed, children }) => {
  if (!isAllowed) {
    return null;
  }
  return (
    <div>
      { children }
    </div>
  );
};

AdminAccess.propTypes = {
  isAllowed: PropTypes.bool,
  children: React.PropTypes.node.isRequired
};

AdminAccess.defaultProps = {
  isAllowed: false
};

const mapStateToProps = state => ({
  isAllowed: userHasRole(state, 'gifts_manager')
});

export default connect(mapStateToProps)(AdminAccess);

