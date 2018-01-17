import React from 'react';
import PropTypes from 'prop-types';
import Heading2 from '../../atoms/Heading2';
import SubHeading from '../../atoms/SubHeading';
import { Button } from 'reactstrap';

const DonateButtonBlock = ({ heading, subheading, buttonText, buttonUrl }) => {
  return (
    <div className="donate-button-block">
      <Heading2>{heading}</Heading2>
      <SubHeading>{subheading}</SubHeading>
      <Button color="white" size="lg" tag="a" href={buttonUrl}>{buttonText}</Button>
    </div>
  );
};

DonateButtonBlock.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  buttonText: PropTypes.string,
  buttonUrl: PropTypes.string,
};

DonateButtonBlock.defaultProps = {
  heading: '',
  subheading: '',
  buttonText: '',
  buttonUrl: '',
};
export default DonateButtonBlock;