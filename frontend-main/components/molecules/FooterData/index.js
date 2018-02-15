import React from 'react';
import PropTypes from 'prop-types';
import PlainText from '../../atoms/PlainText';

const FooterData = ({ copy, imageUrl }) => (
  <div className="footer-data">
    <PlainText className="copy">{copy}</PlainText>
    <img className="logo" src={imageUrl} />
  </div>
);

FooterData.propTypes = {
  copy: PropTypes.string,
  imageUrl: PropTypes.string,
};

export default FooterData;