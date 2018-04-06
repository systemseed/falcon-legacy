import React, { PropTypes } from 'react';

const ArrowIcon = ({ direction }) => (
  <svg className={`arrow-icon arrow-icon-${direction}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
    <g fill="none" fillRule="evenodd">
      <path d="M-3-3h18v18H-3z" />
      <path className="fill" fillRule="nonzero" d="M12 5.25H2.872l4.193-4.192L6 0 0 6l6 6 1.057-1.057L2.872 6.75H12z" />
    </g>
  </svg>
);

ArrowIcon.defaultProps = {
  direction: 'left'
};

ArrowIcon.propTypes = {
  direction: PropTypes.string
};

export default ArrowIcon;
