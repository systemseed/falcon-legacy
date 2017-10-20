import api from '../lib/api';

export const filterByCategory = (gifts, filter) => {
  if (!filter.isFiltered) {
    return gifts;
  }

  const filteredProducts = gifts.products.filter(product => product.categoryId === filter.categoryId);

  // If there are no filtered list of products it means
  // that this filter was selected on another currency
  // and then switched to the new currency. In this case
  // we should return all unfiltered gifts, because this
  // filter is not applicable to this currency (no product).
  if (!filteredProducts.length) {
    return gifts;
  }

  return {
    ...gifts,
    products: filteredProducts
  };
};

/**
 * Filters out products and categories
 * by the current site currency.
 */
export const filterByCurrency = (products, currentCurrency) => {
  const filteredProducts = products.products.filter(product => product.price[currentCurrency] !== undefined);
  const filteredCategoryIds = filteredProducts.map(product => product.categoryId);

  const filteredCategories = products.categories.filter(category => (
    // There is at least one product in this category.
    filteredCategoryIds.indexOf(category.id) !== -1
  ));

  return {
    ...products,
    categories: filteredCategories,
    products: filteredProducts,
  };
};


/**
 * Helper to map product response data to store.
 */
export const mappedProductItem = (responseItem) => {
  let price = {};

  responseItem.variations.forEach((variation) => {
    if (responseItem.fieldGiftVariantType !== 'custom_price') {
      price[variation.price.currency_code] = {
        variation_id: variation.variationId,
        sku: variation.sku,
        amount: variation.price.number,
        currency: variation.price.currency_code
      };
    }
    else {
      price = {
        variation_id: variation.variationId,
        sku: variation.sku,
        amount: 0
      };
    }
  });

  return {
    id: responseItem.id,
    path: responseItem.fieldFieldablePath,
    code: responseItem.fieldGiftProductCode,
    type: 'gift',
    title: responseItem.title,
    variantType: responseItem.fieldGiftVariantType,
    annotation: responseItem.fieldGiftAnnotation ? responseItem.fieldGiftAnnotation.value : '',
    description: responseItem.fieldGiftDescription ? responseItem.fieldGiftDescription.value : '',
    categoryId: responseItem.fieldGiftCategory !== undefined ? responseItem.fieldGiftCategory.id : null,
    price,
    imageUrl: api.getImageUrl('donations', responseItem.fieldGiftImage),
    // "Gift in action" fields.
    actionImageUrl: api.getImageUrl('donations', responseItem.fieldGiftActionImage),
    actionDescription: responseItem.fieldGiftActionDescription ? responseItem.fieldGiftActionDescription.value : '',
    fieldMetatags: responseItem.fieldMetatags !== undefined ? responseItem.fieldMetatags : {},
  };
};
