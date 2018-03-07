import React from 'react';
import PropTypes from 'prop-types';
import FooterData from '../../molecules/FooterData';

const FooterDataPane = ({ styles, copy, imageUrl }) => {
  if (!copy) {
    return null;
  }
  return (
    <div className={"row justify-content-center limited-width registration-data-pane " + styles}>
      <div className="col-12 col-md-8 col-xl-10">
        <FooterData copy={copy} imageUrl={imageUrl}/>
      </div>
    </div>
  );
};

FooterDataPane.propTypes = {
  copy: PropTypes.string,
  imageUrl: PropTypes.string,
};

FooterDataPane.defaultProps = {
  imageUrl: '/static/images/tackling-hunger-logo.png',
  styles: 'bg-grey',
};

export default FooterDataPane;
