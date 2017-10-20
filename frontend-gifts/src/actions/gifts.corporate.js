import * as products from './products';

export function loadAll() {
  return products.getAll('gift_corporate');
}

export function getCustomPriceProduct() {
  return products.getCustomPriceProduct('gift_corporate');
}
