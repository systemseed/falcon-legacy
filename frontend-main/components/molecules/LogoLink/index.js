import React from 'react';
import PropTypes from 'prop-types';
import Logo from '../../atoms/Logo';

const LogoLink = ({ linkUrl, linkTitle, imageUrl, imageTitle, imageAlt }) => {
  return (
    <a href={linkUrl} title={linkTitle}>
      <Logo imageUrl={imageUrl} imageTitle={imageTitle} imageAlt={imageAlt}/>
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
  linkTitle: '',
  imageUrl: '',
  imageTitle: '',
  imageAlt: ''
};

export default LogoLink;