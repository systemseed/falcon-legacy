import React from 'react';
import Slogan from '../../molecules/Slogan';
import LogoLink from '../../molecules/LogoLink';

export default (props) =>
  <div className={"row site-header " + props.styles}>
    <div className="col-4 site-header-logo">
      <LogoLink imageUrl={props.logoUrl}/>
    </div>
    <div className="col-8 site-header-slogan">
      <Slogan>{props.slogan}</Slogan>
    </div>
  </div>
