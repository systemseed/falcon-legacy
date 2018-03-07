import React from 'react';
import sanitizeHtml from 'sanitize-html';

export default (props) => {
  if (!props.children) {
    return null;
  }
  let classes = "plain-text";
  if (props.className !== undefined) {
    classes += " " + props.className;
  }
  return (
    <div className={classes} dangerouslySetInnerHTML={{__html: sanitizeHtml(props.children)}} />
  )
}
