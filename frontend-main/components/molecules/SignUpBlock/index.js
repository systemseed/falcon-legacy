import React from 'react';
import PropTypes from 'prop-types';
import TextBlock from '../TextBlock';

const SignUpBlock = ({ heading, copy }) => {
  return (
    <div className="sign-up-block">
      <TextBlock subheading={heading} copy={copy} />
    </div>
  );
};

SignUpBlock.propTypes = {
  heading: PropTypes.string,
  copy: PropTypes.string,
};

SignUpBlock.defaultProps = {
  heading: '',
  copy: '',
};
export default SignUpBlock;