import React from 'react';
import PropTypes from 'prop-types';
import Heading1WithSubheadingAndCopy from '../../molecules/Heading1WithSubheadingAndCopy';

const PageTitleWithCopy = ({ styles, heading, subheading, copy, singleDonationUrl, regularDonationUrl, buttonText }) => {
  return (
    <div className={"row justify-content-center pagetitle-with-copy limited-width " + styles}>
      <div className="col-12 col-md-8 col-xl-7">
        <Heading1WithSubheadingAndCopy
          heading={heading}
          subheading={subheading}
          copy={copy}
          singleDonationUrl={singleDonationUrl}
          regularDonationUrl={regularDonationUrl}
          buttonText={buttonText}
        />
      </div>
    </div>
  );
};

PageTitleWithCopy.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  copy: PropTypes.string,
  singleDonationUrl: PropTypes.string,
  regularDonationUrl: PropTypes.string,
  buttonText: PropTypes.string
};

export default PageTitleWithCopy;
