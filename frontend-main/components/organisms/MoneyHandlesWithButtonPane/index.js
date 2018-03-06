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
                iconType={data.iconType}
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
    iconType: PropTypes.string,
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
  })),
};

MoneyHandlesWithButtonPane.defaultProps = {
  styles: 'bg-white',
};

export default MoneyHandlesWithButtonPane;
