import React from 'react';

export default (props) =>
  <div className="subheading" dangerouslySetInnerHTML={{__html: props.children}} />