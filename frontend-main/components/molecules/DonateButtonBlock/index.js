import React from 'react';
import PropTypes from 'prop-types';
import Heading2 from '../../atoms/Heading2';
import SubHeading from '../../atoms/SubHeading';
import DonationButton from '../../atoms/DonationButton';

const DonateButtonBlock = ({ heading, subheading, buttonText, buttonUrl }) => {
  return (
    <div className="donate-button-block">
      <Heading2>{heading}</Heading2>
      <SubHeading>{subheading}</SubHeading>
      <DonationButton color="white" size="lg" tag="a" href={buttonUrl}>{buttonText}</DonationButton>
    </div>
  );
};

DonateButtonBlock.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
};

export default DonateButtonBlock;