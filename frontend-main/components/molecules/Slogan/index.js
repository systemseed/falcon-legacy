import React from 'react';

export default (props) =>
  <div className="site-slogan" dangerouslySetInnerHTML={{__html: props.children}} />