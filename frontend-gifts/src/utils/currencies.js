export const getAll = () => ({
  'EUR': 'Euro',
  'GBP': 'Sterling'
});

export const getRegions = () => ({
  'ie': {
    'currency': 'EUR'
  },
  'gb': {
    'currency': 'GBP'
  }
});

export const getSymbolByCurrency = (currency) => {
  const symbols = {
    'EUR': '€',
    'GBP': '£',
  };

  return symbols[currency] !== undefined ? symbols[currency] : '';
};
