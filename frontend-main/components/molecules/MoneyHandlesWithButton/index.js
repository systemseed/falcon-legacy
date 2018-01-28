import React from 'react';
import PropTypes from 'prop-types';
import ButtonWithAmount from '../../atoms/ButtonWithAmount';

const MoneyHandlesWithButton = ({ description, iconUrl, buttonText, buttonUrl }) => {
  const buttonTextWrapped = <span dangerouslySetInnerHTML={{__html: buttonText}} />;
  return (
    <div className="money-handles-with-button bg-green">
      <div className="money-handles-with-button__description">
        <div className="description-inner">
          <img className="money-handles-icon" src={iconUrl} />
          <div className="money-handles-description" dangerouslySetInnerHTML={{__html: description}} />
        </div>
      </div>
      <div className="money-handles-with-button__button">
        <ButtonWithAmount color="secondary" size="lg" tag="a" href={buttonUrl}>{buttonTextWrapped}</ButtonWithAmount>
      </div>
    </div>
  );
};

MoneyHandlesWithButton.propTypes = {
  description: PropTypes.string.isRequired,
  iconUrl: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
};

export default MoneyHandlesWithButton;
