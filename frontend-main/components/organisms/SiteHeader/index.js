import React from 'react';
import Slogan from '../../molecules/Slogan';
import LogoLink from '../../molecules/LogoLink';

export default (props) =>
  <div className="row site-header bg-green ">
    <div className="col-6 site-header-logo">
      <LogoLink image_url="/static/images/logo.png"/>
    </div>
    <div className="col-6 site-header-slogan">
      <Slogan>#TT2 #mumtomum #giveahandtoamum</Slogan>
    </div>
  </div>
