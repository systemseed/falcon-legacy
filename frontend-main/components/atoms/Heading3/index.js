import React from 'react';

export default (props) =>
  <h3 className="h3" dangerouslySetInnerHTML={{__html: props.children}} />