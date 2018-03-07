import React from 'react';
import sanitizeHtml from 'sanitize-html';

export default (props) => {
  if (!props.children) {
    return null;
  }
  return (
    <h3 className="h3" dangerouslySetInnerHTML={{__html: sanitizeHtml(props.children)}} />
  )
}
