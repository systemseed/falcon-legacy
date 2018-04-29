import React from 'react';
import PropTypes from 'prop-types';
import Heading1 from '../../atoms/Heading1';
import SubHeading from '../../atoms/SubHeading';
import PlainText from '../../atoms/PlainText';

const PageTitleCopy = ({ heading, subheading, copy }) => {
  return (
    <div className="copy-with-title-and-subtitle">
      <Heading1>{heading}</Heading1>
      <SubHeading>{subheading}</SubHeading>
      <PlainText>{copy}</PlainText>
    </div>
  );
};

PageTitleCopy.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  copy: PropTypes.string,
};

export default PageTitleCopy;