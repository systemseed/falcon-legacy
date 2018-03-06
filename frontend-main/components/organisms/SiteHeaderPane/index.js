import React from 'react';
import PropTypes from 'prop-types';
import LogoLink from '../../molecules/LogoLink';

const SiteHeaderPane = ({ styles, slogan, linkUrl, linkTitle, imageUrl, imageTitle, imageAlt }) => {
  return (
    <div className={"site-header " + styles}>
      <div className="row limited-width">
        <div className="col-4 site-header__logo">
          <LogoLink linkUrl={linkUrl} linkTitle={linkTitle} imageUrl={imageUrl} imageTitle={imageTitle} imageAlt={imageAlt}/>
        </div>
        <div className="col-8 site-site-header__slogan">
          <div className="site-slogan" dangerouslySetInnerHTML={{__html: slogan}} />
        </div>
      </div>
    </div>
  );
};

SiteHeaderPane.propTypes = {
  styles: PropTypes.string,
  slogan: PropTypes.string,
  linkUrl: PropTypes.string,
  linkTitle: PropTypes.string,
  imageUrl: PropTypes.string,
  imageTitle: PropTypes.string,
  imageAlt: PropTypes.string
};

SiteHeaderPane.defaultProps = {
  imageUrl: '/static/images/logo.png',
  linkUrl: '/',
  styles: ['bg-green'],
};

export default SiteHeaderPane;