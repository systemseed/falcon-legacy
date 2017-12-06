/**
 * Returns products filtered by the current currency.
 */
export const getPrice = (product, currentCurrency) => {
  if (product.variantType === 'custom_price') {
    return false;
  }

  // Check if the product's price is available in the
  // current currency.
  if (!product.price[currentCurrency]) {
    return false;
  }

  return parseFloat(product.price[currentCurrency].amount);
};

/**
 * Checks if the current product is custom price
 * product.
 */
export const isCustomPrice = product => product.variantType === 'custom_price';

/**
 * Checks if the current product is Free product.
 */
export const isFreeProduct = product => product.type === 'gift_free';

/**
 * Checks if the current product is corporate gift.
 */
export const isCorporateGift = product => product.type === 'gift_corporate';

/**
 * Checks if the current product has full view page.
 */
export const hasFullView = (product) => {
  if (isCorporateGift(product)) {
    return true;
  }
  else if (!isCustomPrice(product) && !isFreeProduct(product)) {
    return true;
  }
  return false;
};

/**
 * Returns URL to the product view page.
 */
export const url = (product) => {
  if (product.path) {
    return product.path;
  }

  if (product.type === 'gift_corporate') {
    return `/corporate/${product.id}`;
  }
  return `/gifts/${product.id}`;
};
