import * as products from './products';

export function loadAll() {
  return products.getAll('gift_free');
}
