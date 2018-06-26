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
        { descriptionData.singleDonationUrl.length > 0 &&
          <div className="copy-with-title-and-subtitle">
            <div className="subheading">Would you like to help, but can’t make a monthly donation?</div>
            <div className="plain-text">
              <a href={descriptionData.singleDonationUrl} className="link-pink cw-donate-button">Make a one-time donation here</a>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

SingUpWithDescriptionPane.propTypes = {
  descriptionData: PropTypes.shape({
    singleDonationUrl: PropTypes.string
  }),
  signUpData: PropTypes.shape({
    heading: PropTypes.string,
    copy: PropTypes.string,
    signUpUrl: PropTypes.string
  }),
};

SingUpWithDescriptionPane.defaultProps = {
  styles: 'bg-grey',
};

export default SingUpWithDescriptionPane;
