import React from 'react';
import PropTypes from 'prop-types';
import Heading2 from '../../atoms/Heading2';
import SubHeading from '../../atoms/SubHeading';
import PlainText from '../../atoms/PlainText';

const TextBlock = ({ heading, subheading, copy }) => {
  return (
    <div className="copy-with-title-and-subtitle">
      <Heading2>{heading}</Heading2>
      <SubHeading>{subheading}</SubHeading>
      <PlainText>{copy}</PlainText>
    </div>
  );
};

TextBlock.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  copy: PropTypes.string,
};

TextBlock.defaultProps = {
  heading: '',
  subheading: '',
  copy: '',
};
export default TextBlock;