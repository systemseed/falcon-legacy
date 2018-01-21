import React from 'react';
import { Button } from 'reactstrap';

export default ({ children, ...attributes }) => {
  let className = "cw-donate-button";
  if (attributes.className !== undefined) {
    className += " " + attributes.className;
  }

  return (
    <Button className={className} {...attributes}>{children}</Button>
  )
}
