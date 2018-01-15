import React from 'react';
import PropTypes from 'prop-types';
import MoneyHandlesWithButton from '../../molecules/MoneyHandlesWithButton';

const MoneyHandlesWithButtonPane = ({ styles, moneyHandlesData }) => {
  return (
    <div className={"row money-handles-with-button-pane " + styles}>

      {
        moneyHandlesData.map((data, i) => {
          return (
            <div className="col-12 col-xl-4">
              <MoneyHandlesWithButton
                key={i}
                description={data.description}
                iconUrl={data.iconUrl}
                buttonUrl={data.buttonUrl}
                buttonText={data.buttonText}
              />
            </div>
          )
        })
      }
    </div>
  );
};

MoneyHandlesWithButtonPane.propTypes = {
  styles: PropTypes.string,
  moneyHandlesData: PropTypes.arrayOf(PropTypes.instanceOf(MoneyHandlesWithButton)),
};

export default MoneyHandlesWithButtonPane;
