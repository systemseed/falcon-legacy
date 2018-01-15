import React from 'react';
import PropTypes from 'prop-types';
import MoneyHandlesDescription from '../../atoms/MoneyHandlesDescription';
import MoneyHandlesIcon from '../../atoms/MoneyHandlesIcon';
import DonationButton from '../../atoms/DonationButton';

const MoneyHandlesWithButton = ({ description, iconUrl, buttonText, buttonUrl }) => {
  return (
    <div className="money-handles-with-button">
      <div className="money-handles-with-button--description">
        <MoneyHandlesIcon imageUrl={iconUrl} />
        <MoneyHandlesDescription>{description}</MoneyHandlesDescription>
      </div>
      <div className="money-handles-with-button--button">
        <DonationButton donationUrl={buttonUrl}>{buttonText}</DonationButton>
      </div>
    </div>
  );
};

MoneyHandlesWithButton.propTypes = {
  description: PropTypes.string,
  iconUrl: PropTypes.string,
  buttonText: PropTypes.string,
  buttonUrl: PropTypes.string,
};

export default MoneyHandlesWithButton;