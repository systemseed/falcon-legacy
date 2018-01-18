import React from 'react';

export default (props) => {
  if (!props.children) {
    return null;
  }
  return (
    <div className="subheading" dangerouslySetInnerHTML={{__html: props.children}}/>
  )
}
