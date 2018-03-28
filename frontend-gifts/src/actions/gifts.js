import * as products from './products';

export function loadAll() {
  return products.getAll('gift');
}

export function getCustomPriceProduct() {
  return products.getCustomPriceProduct('gift');
}
