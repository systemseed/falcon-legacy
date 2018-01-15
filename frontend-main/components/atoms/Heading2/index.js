import React from 'react';

export default (props) =>
  <h2 className="h2" dangerouslySetInnerHTML={{__html: props.children}} />