import React from 'react';
import PropTypes from 'prop-types';
import DonationButton from '../../atoms/DonationButton';
import Image from '../../atoms/Image';

const PaypalButton = ({ onClick, ...attributes }) => {
  return (
    <DonationButton className="btn-paypal" name="cw_commerce_paypal" onClick={onClick} {...attributes}><Image name="cw_commerce_paypal" imageUrl="/static/images/paypal-logo-sm.png" imageTitle="Paypal" imageAlt="Paypal" /></DonationButton>
  );
};

PaypalButton.propTypes = {
  onClick: PropTypes.func,
};

export default PaypalButton;