import React from 'react';

export default (props) => {
  if (!props.children) {
    return null;
  }
  return (
    <h1 className="h1" dangerouslySetInnerHTML={{__html: props.children}} />
  )
}
