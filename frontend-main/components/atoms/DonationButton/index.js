import React from 'react';
import { Button } from 'reactstrap';

export default ({ children, className, ...attributes }) => {
  let buttonClass = "cw-donate-button";
  if (className !== undefined) {
    buttonClass += " " + className;
  }

  return (
    <Button className={buttonClass} {...attributes}>{children}</Button>
  )
}
