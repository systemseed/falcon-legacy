import React, { PropTypes } from 'react';
import classNames from 'classnames';

const BlockSubheading = ({ title }) => (
  <div className={classNames('padding-top-3x', 'block', 'block-subheading')}>
    <h3>{title}</h3>
  </div>
);

BlockSubheading.propTypes = {
  'title': PropTypes.string.isRequired
};

export default BlockSubheading;
