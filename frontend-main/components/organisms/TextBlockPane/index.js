import React from 'react';
import PropTypes from 'prop-types';
import TextBlock from '../../molecules/TextBlock';

const TextBlockPane = ({ styles, heading, subheading, copy }) => {
  return (
    <div className={"row justify-content-center text-block-pane limited-width " + styles}>
      <div className="col-12 col-md-8 col-xl-7">
        <TextBlock heading={heading} subheading={subheading} copy={copy} />
      </div>
    </div>
  );
};

TextBlockPane.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  copy: PropTypes.string,
};

TextBlockPane.defaultProps = {
  styles: 'bg-grey',
};

export default TextBlockPane;
