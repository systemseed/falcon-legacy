import React from 'react';
import DonationButton from '../../atoms/DonationButton';

const PaypalButton = ({ ...attributes }) => {
  return (
    <DonationButton className="btn-paypal" name="cw_commerce_paypal" {...attributes}>
      <img name="cw_commerce_paypal" src="/static/images/paypal-logo-sm.png" title="Paypal" alt="Paypal" />
    </DonationButton>
  );
};

export default PaypalButton;