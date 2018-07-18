import React, { PropTypes } from 'react';

const TopBar = ({ headerLeftText, headerRightText }) => (
  <div className="top-bar">
    <div className="container header-container">
      <span className="message hidden-xs" dangerouslySetInnerHTML={{ __html: headerLeftText }} />
      <span className="phone" dangerouslySetInnerHTML={{ __html: headerRightText }} />
    </div>
  </div>
);

TopBar.propTypes = {
  headerLeftText: PropTypes.string.isRequired,
  headerRightText: PropTypes.string.isRequired,
};

export default TopBar;
