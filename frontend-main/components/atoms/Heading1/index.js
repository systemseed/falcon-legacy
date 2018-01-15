import React from 'react';

export default (props) =>
  <h1 className="h1" dangerouslySetInnerHTML={{__html: props.children}} />