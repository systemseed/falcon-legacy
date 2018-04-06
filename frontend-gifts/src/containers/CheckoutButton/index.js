import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as analyticsActions from '../../actions/analytics';

const CheckoutButton = ({ children, dispatch, ...props }) => (
  <Link
    to="/checkout"
    {...props}
    onClick={() => dispatch(analyticsActions.ecommerceCheckout())}
  > {children}</Link >
);

CheckoutButton.propTypes = {
  dispatch: PropTypes.func,
  children: PropTypes.node
};

export default connect()(CheckoutButton);
