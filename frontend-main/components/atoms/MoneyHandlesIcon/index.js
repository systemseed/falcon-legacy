import React from 'react';
import PropTypes from 'prop-types';

const MoneyHandlesIcon = ({ imageUrl, imageTitle, imageAlt }) => {
  return (
    <img className="money-handles-icon" src={imageUrl} title={imageTitle} alt={imageAlt} />
  );
};

MoneyHandlesIcon.propTypes = {
  imageUrl: PropTypes.string,
  imageTitle: PropTypes.string,
  imageAlt: PropTypes.string,
};

MoneyHandlesIcon.defaultProps = {
  imageUrl: '',
  imageTitle: '',
  imageAlt: ''
};

export default MoneyHandlesIcon;