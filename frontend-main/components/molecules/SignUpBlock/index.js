import React from 'react';
import PropTypes from 'prop-types';
import TextBlock from '../TextBlock';
import SignUpForm from '../SignUpForm';

const SignUpBlock = ({ heading, copy, signUpUrl }) => {
  return (
    <div className="sign-up-block">
      <TextBlock subheading={heading} copy={copy} />
      <SignUpForm signUpUrl={signUpUrl} />
    </div>
  );
};

SignUpBlock.propTypes = {
  heading: PropTypes.string,
  copy: PropTypes.string,
  signUpUrl: PropTypes.string,
};

SignUpBlock.defaultProps = {
  heading: 'Find out how you can get involved',
  copy: 'If you are happy to hear more about how you can help transform lives and tackle hunger through volunteering, our campaigns and appeals via email, please enter your address below.',
};

export default SignUpBlock;