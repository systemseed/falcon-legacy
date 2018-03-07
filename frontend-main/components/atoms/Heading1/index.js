import React from 'react';
import sanitizeHtml from 'sanitize-html';

export default (props) => {
  if (!props.children) {
    return null;
  }
  return (
    <h1 className="h1" dangerouslySetInnerHTML={{__html: sanitizeHtml(props.children)}} />
  )
}
