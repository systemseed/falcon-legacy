import React from 'react';
import PropTypes from 'prop-types';
import DonateButtonBlock from '../../molecules/DonateButtonBlock';

const DonateButtonPane = ({ styles, heading, subheading, buttonText, buttonUrl }) => {
  return (
    <div className={"row donate-button-pane " + styles}>
      <div className="col-12">
        <DonateButtonBlock heading={heading} subheading={subheading} buttonText={buttonText} buttonUrl={buttonUrl} />
      </div>
    </div>
  );
};

DonateButtonPane.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  buttonText: PropTypes.string,
  buttonUrl: PropTypes.string,
};

DonateButtonPane.defaultProps = {
  subheading: '',
  buttonText: 'Donate Now',
  styles: ['bg-green'],
};

export default DonateButtonPane;
