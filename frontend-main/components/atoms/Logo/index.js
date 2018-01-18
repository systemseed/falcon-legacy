import React from 'react';
import PropTypes from 'prop-types';

const Logo = ({ imageUrl, imageTitle, imageAlt }) => {
  if (!imageUrl) {
    return null;
  }
  return (
    <img src={imageUrl} title={imageTitle} alt={imageAlt} />
  );
};

Logo.propTypes = {
  imageUrl: PropTypes.string,
  imageTitle: PropTypes.string,
  imageAlt: PropTypes.string,
};

Logo.defaultProps = {
  imageUrl: '',
  imageTitle: '',
  imageAlt: ''
};

export default Logo;