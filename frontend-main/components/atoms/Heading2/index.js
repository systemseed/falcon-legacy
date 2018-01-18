import React from 'react';

export default (props) => {
  if (!props.children) {
    return null;
  }
  return (
    <h2 className="h2" dangerouslySetInnerHTML={{__html: props.children}} />
  )
}
