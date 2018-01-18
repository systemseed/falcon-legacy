import React from 'react';
import PropTypes from 'prop-types';
import MoneyHandlesWithButton from '../../molecules/MoneyHandlesWithButton';

const MoneyHandlesWithButtonPane = ({ styles, moneyHandlesData }) => {
  return (
    <div className={"row money-handles-with-button-pane limited-width " + styles}>

      {
        moneyHandlesData.map((data, i) => {
          return (
            <div className="col-12 col-xl-4" key={i}>
              <MoneyHandlesWithButton
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
  moneyHandlesData: PropTypes.arrayOf(PropTypes.shape({
    description: PropTypes.string,
    iconUrl: PropTypes.string,
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
  })),
};

export default MoneyHandlesWithButtonPane;
