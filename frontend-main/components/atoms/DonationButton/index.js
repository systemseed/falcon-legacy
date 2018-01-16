import React from 'react';
import PropTypes from 'prop-types';

const DonationButton = ({ type, textSize, block, active, disabled, onClick, children }) => {
  let classes = ['btn', 'donation-btn'];
  if (type) {
    classes.push('btn-' + type);
  }

  if (textSize) {
    classes.push('btn-text-' + textSize);
  }

  if (block) {
    classes.push('btn-block');
  }

  if (active) {
    classes.push('btn-active');
  }

  if (disabled) {
    classes.push('btn-disabled');
  }

  return (
    <button type="button" onClick={onClick} className={classes.join(' ')}>
      {children}
    </button>
  );
};

DonationButton.propTypes = {
  donationUrl: PropTypes.string,
  type: PropTypes.oneOf(['white', 'pink']),
  textSize: PropTypes.oneOf(['lg', 'md', 'sm', 'xs']),
  block: PropTypes.bool,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

DonationButton.defaultProps = {
  type: 'pink',
  textSize: 'md',
  block: false,
  active: false,
  disabled: false,
  onClick: () => {},
};

export default DonationButton;