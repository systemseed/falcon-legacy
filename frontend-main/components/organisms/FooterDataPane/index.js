import React from 'react';
import PropTypes from 'prop-types';
import FooterData from '../../molecules/FooterData';

const FooterDataPane = ({ styles, copy, footerLogosUrls }) => {
  if (!copy) {
    return null;
  }
  return (
    <div className={"row justify-content-center limited-width registration-data-pane " + styles}>
      <div className="col-12 col-md-8 col-xl-10">
        <FooterData copy={copy} footerLogosUrls={footerLogosUrls}/>
      </div>
    </div>
  );
};

FooterDataPane.propTypes = {
  copy: PropTypes.string,
  imageUrl: PropTypes.string,
};

FooterDataPane.defaultProps = {
  footerLogosUrls: {
    hunger: '/static/images/tackling-hunger-logo.png',
    regulator: '/static/images/fundraising-regulator.png'
  },
  styles: 'bg-grey',
};

export default FooterDataPane;
