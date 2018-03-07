import React from 'react';
import sanitizeHtml from 'sanitize-html';

export default (props) => {
  if (!props.children) {
    return null;
  }
  return (
    <h2 className="h2" dangerouslySetInnerHTML={{__html: sanitizeHtml(props.children)}} />
  )
}
