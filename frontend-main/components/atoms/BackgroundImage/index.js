import React from 'react';
import PropTypes from 'prop-types';

const BackgroundImage = ({ imageUrl, ...attributes }) => {
  if (!imageUrl) {
    return null;
  }
  const baseUrl = process.env.BASE_URL || window.BASE_URL || '';
  const compStyle = {
    backgroundImage: 'url(' + baseUrl + imageUrl + ')'
  };
  return (
    <div className="background-image" style={compStyle} {...attributes} />
  );
};

BackgroundImage.propTypes = {
  imageUrl: PropTypes.string
};

export default BackgroundImage;