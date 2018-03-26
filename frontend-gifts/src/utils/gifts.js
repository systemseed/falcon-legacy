import api from '../lib/api';

export const filterByCategory = (gifts, filter) => {
  if (!filter.isFiltered) {
    return gifts;
  }

  const filteredProducts = gifts.products.filter(
    product => product.categoryId === filter.categoryId
  );

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
  const filteredProducts = products.products.filter(
    product => product.price[currentCurrency] !== undefined
  );
  const filteredCategoryIds = filteredProducts.map(
    product => product.categoryId
  );

  const filteredCategories = products.categories.filter(
    category =>
      // There is at least one product in this category.
      filteredCategoryIds.indexOf(category.id) !== -1
  );

  return {
    ...products,
    categories: filteredCategories,
    products: filteredProducts
  };
};

/**
 * Helper to map product response data to store.
 */
export const mappedProductItem = (responseItem) => {
  let price = {};
  let giftsInBundle = [];

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

  if (responseItem.fieldGiftVariantType === 'bundle') {
    giftsInBundle = responseItem.fieldGiftsInBundle.map(item =>
      mappedProductItem(item)
    );
  }

  const whatYouGetImage = {
    src: api.getImageUrl('donations', responseItem.fieldGiftWhatYouGetImage),
    alt: api.getImageAlt(
      responseItem.relationships.field_gift_what_you_get_image
    ),
  };

  const postalPreviewImage = {
    src: api.getImageUrl('donations', responseItem.fieldGiftPostalPreviewImage),
    alt: api.getImageAlt(
      responseItem.relationships.field_gift_postal_preview_image
    ),
  };

  const ecardPreviewImage = {
    src: api.getImageUrl('donations', responseItem.fieldGiftEcardPreviewImage),
    alt: api.getImageAlt(
      responseItem.relationships.field_gift_ecard_preview_image
    ),
  };

  return {
    id: responseItem.id,
    path: responseItem.fieldFieldablePath,
    code: responseItem.fieldGiftProductCode,
    type: 'gift',
    title: responseItem.title,
    variantType: responseItem.fieldGiftVariantType,
    annotation: responseItem.fieldGiftAnnotation
      ? responseItem.fieldGiftAnnotation.value
      : '',
    description: responseItem.fieldGiftDescription
      ? responseItem.fieldGiftDescription.value
      : '',
    categoryId:
      responseItem.fieldGiftCategory !== undefined
        ? responseItem.fieldGiftCategory.id
        : null,
    price,
    imageUrl: api.getImageUrl('donations', responseItem.fieldGiftImage),
    imageAlt: responseItem.relationships.field_gift_image.data.meta.alt,
    // "Gift in action" fields.
    actionImageUrl: api.getImageUrl(
      'donations',
      responseItem.fieldGiftActionImage
    ),
    actionImageAlt:
      responseItem.relationships.field_gift_action_image.data.meta.alt,
    actionDescription: responseItem.fieldGiftActionDescription
      ? responseItem.fieldGiftActionDescription.value
      : '',
    fieldMetatags:
      responseItem.fieldMetatags !== undefined
        ? responseItem.fieldMetatags
        : {},
    giftsInBundle,
    whatYouGetImage,
    postalPreviewImage,
    ecardPreviewImage,
    fieldPostalPreviewBody: responseItem.fieldGiftPostalPreviewBody,
    fieldEcardPreviewBody: responseItem.fieldGiftEcardPreviewBody,
  };
};
