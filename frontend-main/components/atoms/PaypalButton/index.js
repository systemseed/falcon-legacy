import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import Image from '../../atoms/Image';

const PaypalButton = ({ onClick, ...attributes }) => {
  return (
    <Button className="btn-paypal" name="paypal" onClick={onClick} {...attributes}><Image name="paypal" imageUrl="/static/images/paypal-logo-sm.png" imageTitle="Paypal" imageAlt="Paypal" /></Button>
  );
};

PaypalButton.propTypes = {
  onClick: PropTypes.func,
};

export default PaypalButton;