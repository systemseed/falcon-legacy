import React from 'react';
import PropTypes from 'prop-types';
import MoneyHandlesDescription from '../../atoms/MoneyHandlesDescription';
import MoneyHandlesIcon from '../../atoms/MoneyHandlesIcon';
import ButtonWithAmount from '../../atoms/ButtonWithAmount';

const MoneyHandlesWithButton = ({ description, iconUrl, buttonText, buttonUrl }) => {
  const buttonTextWrapped = <span dangerouslySetInnerHTML={{__html: buttonText}} />;
  return (
    <div className="money-handles-with-button bg-green">
      <div className="money-handles-with-button__description">
        <div className="description-inner">
          <MoneyHandlesIcon imageUrl={iconUrl} />
          <MoneyHandlesDescription>{description}</MoneyHandlesDescription>
        </div>
      </div>
      <div className="money-handles-with-button__button">
        <ButtonWithAmount color="secondary" size="lg" tag="a" href={buttonUrl}>{buttonTextWrapped}</ButtonWithAmount>
      </div>
    </div>
  );
};

MoneyHandlesWithButton.propTypes = {
  description: PropTypes.string,
  iconUrl: PropTypes.string,
  buttonText: PropTypes.string,
  buttonUrl: PropTypes.string,
};

export default MoneyHandlesWithButton;