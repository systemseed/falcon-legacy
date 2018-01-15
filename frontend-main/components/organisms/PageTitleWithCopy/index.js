import React from 'react';
import PropTypes from 'prop-types';
import Heading1WithSubheadingAndCopy from '../../molecules/Heading1WithSubheadingAndCopy';

const PageTitleWithCopy = ({ styles, heading, subheading, copy }) => {
  return (
    <div className={"row justify-content-center pagetitle-with-copy " + styles}>
      <div className="col-12 col-md-8 col-xl-6">
        <Heading1WithSubheadingAndCopy heading={heading} subheading={subheading} copy={copy} />
      </div>
    </div>
  );
};

PageTitleWithCopy.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  copy: PropTypes.string,
};

export default PageTitleWithCopy;
