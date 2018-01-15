import React from 'react';

export default (props) =>
  <div className="money-handles-description" dangerouslySetInnerHTML={{__html: props.children}} />