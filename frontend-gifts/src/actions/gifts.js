import * as products from './products';

export function loadAll() {
  return products.getAll('gift');
}

export function getCustomPriceProduct() {
  return products.getCustomPriceProduct('gift');
}

export function setFilterByCategory(categoryId) {
  return {
    type: 'SET_GIFTS_FILTER_BY_CATEGORY',
    categoryId,
  };
}

export function removeFilterByCategory() {
  return {
    type: 'REMOVE_GIFTS_FILTER_BY_CATEGORY',
  };
}
