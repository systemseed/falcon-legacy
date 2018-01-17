import React from 'react';
import PropTypes from 'prop-types';
import DonationButton from '../../atoms/DonationButton';

const DonationFormBlock = ({ currency, singleDonationUrl, regularDonationUrl, paypalDonationUrl, predefinedValues, buttonText }) => {
  return (
    <div className="donation-form-block">
      <div className="predefined-values">
        <input type="radio" name="predefined_value" id="predefined_value_1" /><label for="predefined_value_1">£10</label>
        <input type="radio" name="predefined_value" id="predefined_value_2" /><label for="predefined_value_2">£20</label>
        <input type="radio" name="predefined_value" id="predefined_value_3" /><label for="predefined_value_3">£30</label>
      </div>
      <div>
        <input type="text" className="donation-amount" aria-label="£0.00" />
      </div>
      <div>
        <div className="donate-monthly">
          <input type="checkbox" name="donate_monthly" id="donate-monthly"/><label for="donate-monthly">Donate Monthly</label>
        </div>
        <button type="button" className="donate-by-paypal btn-with-border">Paypal</button>
      </div>

      <DonationButton donationUrl={singleDonationUrl}>{buttonText}</DonationButton>
    </div>
  );
};

DonationFormBlock.propTypes = {
  currency: PropTypes.string,
  singleDonationUrl: PropTypes.string,
  regularDonationUrl: PropTypes.string,
  paypalDonationUrl: PropTypes.string,
  predefinedValues: PropTypes.arrayOf(PropTypes.number),
  buttonText: PropTypes.string
};

export default DonationFormBlock;