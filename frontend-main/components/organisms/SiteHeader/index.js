import React from 'react';
import PropTypes from 'prop-types';
import Slogan from '../../molecules/Slogan';
import LogoLink from '../../molecules/LogoLink';

const SiteHeader = ({ styles, slogan, linkUrl, linkTitle, imageUrl, imageTitle, imageAlt }) => {
  return (
    <div className={"site-header " + styles}>
      <div className="row limited-width">
        <div className="col-4 site-header-logo">
          <LogoLink linkUrl={linkUrl} linkTitle={linkTitle} imageUrl={imageUrl} imageTitle={imageTitle} imageAlt={imageAlt}/>
        </div>
        <div className="col-8 site-header-slogan">
          <Slogan>{slogan}</Slogan>
        </div>
      </div>
    </div>
  );
};

SiteHeader.propTypes = {
  styles: PropTypes.string,
  slogan: PropTypes.string,
  linkUrl: PropTypes.string,
  linkTitle: PropTypes.string,
  imageUrl: PropTypes.string,
  imageTitle: PropTypes.string,
  imageAlt: PropTypes.string
};

SiteHeader.defaultProps = {
  styles: '',
  slogan: '',
  linkUrl: '/',
  linkTitle: '',
  imageUrl: '',
  imageTitle: '',
  imageAlt: ''
};

export default SiteHeader;