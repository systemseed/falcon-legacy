import React from 'react';
import PropTypes from 'prop-types';

const Image = ({ imageUrl, imageTitle, imageAlt }) => {
  return (
    <img src={imageUrl} title={imageTitle} alt={imageAlt} />
  );
};

Image.propTypes = {
  imageUrl: PropTypes.string,
  imageTitle: PropTypes.string,
  imageAlt: PropTypes.string,
};

Image.defaultProps = {
  imageUrl: '',
  imageTitle: '',
  imageAlt: ''
};

export default Image;