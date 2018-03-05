import React from 'react';
import PropTypes from 'prop-types';
import DonationFormBlock from '../../molecules/DonationFormBlock';
import BackgroundImage from '../../atoms/BackgroundImage';

const HeroWithDonationBlockPane = ({ styles, heroData, donationBlockData }) => {
  return (
    <div className={"row hero-with-donation-block-pane limited-width " + styles}>
      <div className="hero-with-donation-block-pane__image col-12 col-md-7 col-lg-8 p-0">
        <BackgroundImage {...heroData} />
      </div>
      <div className="hero-with-donation-block-pane__form col-md-5 col-lg-4 p-0">
        <div className="hero-with-donation-block-pane__form-wrapper">
          <DonationFormBlock {...donationBlockData} />
        </div>
      </div>
    </div>
  );
};

HeroWithDonationBlockPane.propTypes = {
  heroData: PropTypes.shape({
    imageUrl: PropTypes.string
  }),
  donationBlockData: PropTypes.shape({
    currency: PropTypes.string,
    singleDonationUrl: PropTypes.string,
    regularDonationUrl: PropTypes.string,
    paypalDonationUrl: PropTypes.string,
    predefinedValues: PropTypes.arrayOf(PropTypes.string),
    buttonText: PropTypes.string
  }),
};

export default HeroWithDonationBlockPane;
