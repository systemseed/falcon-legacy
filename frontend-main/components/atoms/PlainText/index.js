import React from 'react';

export default (props) =>
  <div className="plain-text" dangerouslySetInnerHTML={{__html: props.children}} />