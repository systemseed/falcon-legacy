import React from 'react';
import PropTypes from 'prop-types';
import PlainText from '../../atoms/PlainText';

const FooterData = ({copy, footerLogosUrls}) => {
  return (
    <div className="footer-data row no-gutters">
      <PlainText className="copy col-12 col-lg-9 no-gutters">{copy}</PlainText>
      <div className="col-12 col-lg-3 no-gutters">
        <div className="logos">
          <img className="logo logo--regulator" src={footerLogosUrls.regulator}/>
          <img className="logo" src={footerLogosUrls.hunger}/>
        </div>
      </div>
    </div>
  )
};

FooterData.propTypes = {
  copy: PropTypes.string,
  footerLogoUrls: PropTypes.object,
};

export default FooterData;