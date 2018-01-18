import React from 'react';

export default (props) => {
  if (!props.children) {
    return null;
  }
  return (
    <h3 className="h3" dangerouslySetInnerHTML={{__html: props.children}} />
  )
}
