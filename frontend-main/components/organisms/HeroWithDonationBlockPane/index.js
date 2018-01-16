import React from 'react';
import PropTypes from 'prop-types';
import TextBlock from '../../molecules/TextBlock';
import Image from '../../atoms/Image';

const HeroWithDonationBlockPane = ({ styles, heroData, donationBlockData }) => {
  return (
    <div className={"row hero-with-donation-block-pane " + styles}>
      <div className="hero-with-donation-block-pane__image col-12 col-md-8 p-0">
        <Image imageUrl={heroData.imageUrl} imageTitle={heroData.imageTitle} imageAlt={heroData.imageAlt}/>
      </div>
      <div className="hero-with-donation-block-pane__form d-none col-md-4 p-0">
        <TextBlock subheading={donationBlockData.buttonText} copy={donationBlockData.buttonText} />
      </div>
    </div>
  );
};

HeroWithDonationBlockPane.propTypes = {
  heroData: PropTypes.shape({
    imageUrl: PropTypes.string,
    imageAlt: PropTypes.string,
    imageTitle: PropTypes.string
  }),
  donationBlockData: PropTypes.shape({
    currencySymbol: PropTypes.string,
    singleDonationUrl: PropTypes.string,
    regularDonationUrl: PropTypes.string,
    paypalDonationUrl: PropTypes.string,
    predefinedValues: PropTypes.arrayOf(PropTypes.number),
    buttonText: PropTypes.string
  }),
};

export default HeroWithDonationBlockPane;
