import React from 'react';
import PropTypes from 'prop-types';
import PageTitleCopyDonateBlock from '../../molecules/PageTitleCopyDonateBlock';

const PageTitleCopyDonatePane = ({ styles, heading, subheading, copy, singleDonationUrl, regularDonationUrl, buttonText }) => {
  return (
    <div className={"row justify-content-center pagetitle-with-copy limited-width " + styles}>
      <div className="col-12 col-md-8 col-xl-7">
        <PageTitleCopyDonateBlock
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

PageTitleCopyDonatePane.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  copy: PropTypes.string,
  singleDonationUrl: PropTypes.string,
  regularDonationUrl: PropTypes.string,
  buttonText: PropTypes.string
};

PageTitleCopyDonatePane.defaultProps = {
  buttonText: 'Donate',
  styles: 'bg-grey',
};

export default PageTitleCopyDonatePane;
