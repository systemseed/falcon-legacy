import React from 'react';
import Heading1WithSubheadingAndCopy from '../../molecules/Heading1WithSubheadingAndCopy';

export default (props) =>
  <div className={"row justify-content-center pagetitle-with-copy " + props.styles}>
    <div className="col-12 col-md-8 col-xl-6">
      <Heading1WithSubheadingAndCopy/>
    </div>
  </div>

