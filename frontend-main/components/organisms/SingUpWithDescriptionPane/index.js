import React from 'react';
import PropTypes from 'prop-types';
import SignUpBlock from '../../molecules/SignUpBlock';

const SingUpWithDescriptionPane = ({ styles, descriptionData, signUpData }) => {
  return (
    <div className={"row sign-up-with-description-pane limited-width " + styles}>
      <div className="sign-up-with-description__form col-12 col-md-8 offset-md-2 col-xl-5 offset-xl-1 order-xl-2">
        <SignUpBlock heading={signUpData.heading} copy={signUpData.copy} signUpUrl={signUpData.signUpUrl} />
      </div>
      <div className="sign-up-with-description__description col-12 col-md-8 offset-md-2 col-xl-4 offset-xl-1 order-xl-1">
        <div className="copy-with-title-and-subtitle">
          <div className="subheading">{descriptionData.heading}</div>
          <div className="plain-text">
            <a href={descriptionData.singleDonationUrl} className="link-pink cw-donate-button">Make a one-time donation here</a>
          </div>
        </div>
      </div>
    </div>
  );
};

SingUpWithDescriptionPane.propTypes = {
  descriptionData: PropTypes.shape({
    heading: PropTypes.string,
    singleDonationUrl: PropTypes.string
  }),
  signUpData: PropTypes.shape({
    heading: PropTypes.string,
    copy: PropTypes.string,
    signUpUrl: PropTypes.string
  }),
};

SingUpWithDescriptionPane.defaultProps = {
  descriptionData: {
    heading: 'Would you like to help, but can’t make a monthly donation?',
  },
  signUpData: {
    heading: 'Find out how you can get involved',
    copy: 'If you are happy to hear more about how you can help transform lives and tackle hunger through volunteering, our campaigns and appeals via email, please enter your address below.',
    signUpUrl: PropTypes.string
  },
  styles: ['bg-grey'],
};

export default SingUpWithDescriptionPane;
