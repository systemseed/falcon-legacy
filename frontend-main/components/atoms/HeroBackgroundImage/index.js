import React from 'react';
import PropTypes from 'prop-types';

const HeroBackgroundImage = ({ imageUrl, ...attributes }) => {
  if (!imageUrl) {
    return null;
  }
  const baseUrl = process.env.BASE_URL || window.BASE_URL || '';
  const compStyle = {
    backgroundImage: 'url(' + baseUrl + imageUrl + ')'
  };
  return (
    <div className="hero-background-image" style={compStyle} {...attributes} />
  );
};

HeroBackgroundImage.propTypes = {
  imageUrl: PropTypes.string
};

export default HeroBackgroundImage;