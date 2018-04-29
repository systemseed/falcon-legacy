import React from 'react';
import PropTypes from 'prop-types';
import PageTitleCopy from '../../molecules/PageTitleCopy';

const PageTitleCopyPane = ({ styles, heading, subheading, copy }) => {
  return (
    <div className={"row justify-content-center pagetitle-with-copy limited-width " + styles}>
      <div className="col-12 col-md-8 col-xl-7">
        <PageTitleCopy
          heading={heading}
          subheading={subheading}
          copy={copy}
        />
      </div>
    </div>
  );
};

PageTitleCopyPane.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  copy: PropTypes.string,
};

PageTitleCopyPane.defaultProps = {
  styles: 'bg-grey',
};

export default PageTitleCopyPane;
