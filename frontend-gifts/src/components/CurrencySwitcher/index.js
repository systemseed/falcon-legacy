import React, { PropTypes } from 'react';

const style = {
  listStyleType: 'none',
  margin: '0',
  padding: '10px 0 0 0',
  li: {
    display: 'inline-block',
    marginLeft: '4px'
  }
};

const CurrencySwitcher = ({ currencies, currentCurrency, handleChangeCurrency }) => (
  <ul style={style}>

    <li style={style.li} key={currentCurrency}>
      <span>
        Prices shown are in {currencies[currentCurrency]}
      </span>
    </li>

    {
      Object.keys(currencies)
        .filter(currency => (currency !== currentCurrency))
        .map(currency => (
          <li style={style.li} key={currency}>
            <a href={`#${currency}`} onClick={handleChangeCurrency(currency)}>
              Change to {currencies[currency]}</a>
          </li>
        ))
    }
  </ul>
);

CurrencySwitcher.propTypes = {
  currencies: PropTypes.object.isRequired,
  currentCurrency: PropTypes.string.isRequired,
  handleChangeCurrency: PropTypes.func.isRequired
};

export default CurrencySwitcher;
