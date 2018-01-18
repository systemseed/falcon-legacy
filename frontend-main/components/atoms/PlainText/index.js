import React from 'react';

export default (props) => {
  if (!props.children) {
    return null;
  }
  return (
    <div className="plain-text" dangerouslySetInnerHTML={{__html: props.children}} />
  )
}
