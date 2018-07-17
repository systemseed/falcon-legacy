import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

const CheckoutCardsButton = ({ children, ...props }) => (
  <Link
    to="/cards"
    {...props}
  > {children}</Link >
);

CheckoutCardsButton.propTypes = {
  children: PropTypes.node
};

export default CheckoutCardsButton;
