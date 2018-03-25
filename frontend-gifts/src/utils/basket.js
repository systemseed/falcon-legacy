import * as productUtils from './products';

/**
 * Return list of products in the basket
 * for the current site currency.
 */
export const getProducts = (products, currentCurrency) => {
  if (!products.length) {
    return [];
  }

  // Remove products without price in the current currency
  // from the list.
  return products.filter((product) => {
    if (product.data.variantType === 'custom_price') {
      return true;
    }
    return product.data.price[currentCurrency] !== undefined;
  });
};

/**
 * Returns quantity of the given product
 * in the basket.
 */
export const getProductQuantity = product => (
  parseInt(product.quantity, 0)
);

/**
 * Returns price of the given product
 * in the current site currency.
 */
export const getProductPrice = (product, currentCurrency) => {
  let amount;
  if (product.data.variantType === 'custom_price') {
    amount = product.data.price.amount;
  }
  else {
    amount = product.data.price[currentCurrency].amount;
  }
  return parseFloat(amount);
};

export const getProductSubtotal = (product, currentCurrency) => {
  const subtotal = getProductPrice(product, currentCurrency) * getProductQuantity(product);
  return parseFloat(subtotal);
};


/**
 * Calculates total price of all products
 * in the basket.
 */
export const getTotal = (products, currentCurrency) => {
  const currentProducts = getProducts(products, currentCurrency);
  return currentProducts.reduce((total, product) => {
    const quantity = getProductQuantity(product);
    const price = getProductPrice(product, currentCurrency);
    return total + (price * quantity);
  }, 0);
};

/**
 * Returns total amount of products (with quantity)
 * in the basket.
 */
export const getItemsCount = (products, currentCurrency) => {
  const currentProducts = getProducts(products, currentCurrency);
  return currentProducts.reduce((itemsCount, product) => itemsCount + product.quantity, 0);
};

/**
 * Checks if the current product has delete button.
 */
export const hasDeleteButton = product => !productUtils.isFreeProduct(product);

/**
 * Checks if the current product has Quantity widget.
 */
export const hasQuantityWidget = product =>
  !productUtils.isCustomPrice(product) && !productUtils.isFreeProduct(product);
