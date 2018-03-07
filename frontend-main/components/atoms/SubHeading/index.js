import React from 'react';
import sanitizeHtml from 'sanitize-html';

export default (props) => {
  if (!props.children) {
    return null;
  }
  return (
    <div className="subheading" dangerouslySetInnerHTML={{__html: sanitizeHtml(props.children)}}/>
  )
}
