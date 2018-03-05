import React from 'react';
import PropTypes from 'prop-types';

const BackgroundImage = ({ imageUrl, imageAlt, imageTitle, ...attributes }) => {
  if (!imageUrl) {
    return null;
  }
  const compStyle = {
    backgroundImage: 'url(' + imageUrl + ')'
  };
  return (
    <div className="background-image" alt={imageAlt} title={imageTitle} style={compStyle} {...attributes} />
  );
};

BackgroundImage.propTypes = {
  imageUrl: PropTypes.string,
  imageAlt: PropTypes.string,
  imageTitle: PropTypes.string
};

export default BackgroundImage;