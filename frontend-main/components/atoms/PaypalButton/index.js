import React from 'react';
import PropTypes from 'prop-types';
import DonationButton from '../../atoms/DonationButton';
import Image from '../../atoms/Image';

const PaypalButton = ({ onClick, ...attributes }) => {
  return (
    <DonationButton className="btn-paypal" name="paypal" onClick={onClick} {...attributes}><Image name="paypal" imageUrl="/static/images/paypal-logo-sm.png" imageTitle="Paypal" imageAlt="Paypal" /></DonationButton>
  );
};

PaypalButton.propTypes = {
  onClick: PropTypes.func,
};

export default PaypalButton;