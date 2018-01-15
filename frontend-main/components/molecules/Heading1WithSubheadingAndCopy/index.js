import React from 'react';
import Heading1 from '../../atoms/Heading1';
import SubHeading from '../../atoms/SubHeading';
import PlainText from '../../atoms/PlainText';

export default (props) =>
  <div className="copy-with-title-and-subtitle">
    <Heading1>{props.heading}</Heading1>
    <SubHeading>{props.subheading}</SubHeading>
    <PlainText>{props.copy}</PlainText>
  </div>