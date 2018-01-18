import React from 'react';

export default (props) => {
  if (!props.children) {
    return null;
  }
  return (
    <div className="money-handles-description" dangerouslySetInnerHTML={{__html: props.children}} />
  )
}
