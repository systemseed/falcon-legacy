import React from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from '../../../utils/sanitizeHtml';
import ButtonWithAmount from '../../atoms/ButtonWithAmount';

const MoneyHandlesWithButton = ({ description, iconType, buttonText, buttonUrl }) => {
  const buttonTextWrapped = <span dangerouslySetInnerHTML={{__html: sanitizeHtml(buttonText)}} />;
  const iconUrl = '/static/images/money-handles/' + iconType + '.svg';
  return (
    <div className="money-handles-with-button bg-green">
      <div className="money-handles-with-button__description">
        <div className="description-inner">
          <img className="money-handles-icon" src={iconUrl} />
          <div className="money-handles-description" dangerouslySetInnerHTML={{__html: sanitizeHtml(description)}} />
        </div>
      </div>
      <img className="money-handles-icon money-handles-icon--desktop" src={iconUrl} />
      <div className="money-handles-with-button__button">
        <ButtonWithAmount color="secondary" size="lg" buttonUrl={buttonUrl}>{buttonTextWrapped}</ButtonWithAmount>
      </div>
    </div>
  );
};

MoneyHandlesWithButton.propTypes = {
  description: PropTypes.string.isRequired,
  iconType: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
};

export default MoneyHandlesWithButton;
