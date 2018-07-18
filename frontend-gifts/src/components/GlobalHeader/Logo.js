import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => (
  <span className="site-logo-wrapper">
    <Link to="/" className="site-logo visible-desktop">
      <img src="/images/logo.png" alt="Gifts" />
    </Link>
    <Link to="/" className="site-logo visible-mobile">
      <img src="/images/logo.png" alt="Gifts" />
    </Link>
  </span>
);

export default Logo;
