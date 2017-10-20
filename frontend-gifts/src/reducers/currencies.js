import * as currencies from '../utils/currencies';
import config from '../config';

// Helper to set default state of currency
const currencyDefaultState = () => {
  const regions = currencies.getRegions();
  // See platform-deploy.js script.
  return regions[config.region].currency;
};

export const currentCurrency = (state = currencyDefaultState(), action) => {
  switch (action.type) {
    case 'SET_CURRENT_CURRENCY':
      return action.currency;

    default:
      return state;
  }
};
