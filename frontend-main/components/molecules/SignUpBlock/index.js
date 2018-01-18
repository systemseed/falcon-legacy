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
  heading: '',
  copy: '',
  signUpUrl: '',
};
export default SignUpBlock;