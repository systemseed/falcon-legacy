import React from 'react';
import PropTypes from 'prop-types';

const LogoLink = ({ linkUrl, linkTitle, imageUrl, imageTitle, imageAlt }) => {
  return (
    <a href={linkUrl} title={linkTitle}>
      <img src={imageUrl} title={imageTitle} alt={imageAlt}/>
    </a>
  );
};

LogoLink.propTypes = {
  linkUrl: PropTypes.string,
  linkTitle: PropTypes.string,
  imageUrl: PropTypes.string,
  imageTitle: PropTypes.string,
  imageAlt: PropTypes.string
};

LogoLink.defaultProps = {
  linkUrl: '/',
};

export default LogoLink;