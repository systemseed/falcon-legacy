import api from '../lib/api';

/**
 * Returns products filtered by the current currency.
 *
 * @param products
 * @param currentCurrency
 */
export const filterByCurrency = (products, currentCurrency) => ({
  ...products,
  products: products.products.filter((product) => {
    if (product.variantType === 'custom_price') {
      return true;
    }
    return product.price[currentCurrency] !== undefined;
  }),
});


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
    type: 'gift_corporate',
    title: responseItem.title,
    variantType: responseItem.fieldGiftVariantType,
    annotation: responseItem.fieldGiftAnnotation ? responseItem.fieldGiftAnnotation.value : '',
    description: responseItem.fieldGiftDescription ? responseItem.fieldGiftDescription.value : '',
    categoryId: responseItem.fieldGiftCategory !== undefined ? responseItem.fieldGiftCategory.id : null,
    price,
    imageUrl: api.getImageUrl('donations', responseItem.fieldGiftImage, 'width_660'),
    imageAlt: responseItem.relationships.field_gift_image.data.meta.alt,
    descriptionImageUrl: api.getImageUrl('donations', responseItem.fieldGiftDescriptionImage, 'width_720'),
    descriptionImageAlt: api.getImageAlt(responseItem.relationships.field_gift_description_image, responseItem.title),
    fieldMetatags: responseItem.fieldMetatags !== undefined ? responseItem.fieldMetatags : {},
  };
};
