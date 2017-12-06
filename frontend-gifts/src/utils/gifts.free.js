import api from '../lib/api';
import * as basketUtils from '../utils/basket';

/**
 * Helper to map product response data to store.
 */
export const mappedProductItem = (responseItem) => {
  const price = {};

  responseItem.variations.forEach((variation) => {
    price[variation.price.currency_code] = {
      variation_id: variation.variationId,
      sku: variation.sku,
      amount: variation.price.number,
      currency: variation.price.currency_code
    };
  });

  return {
    id: responseItem.id,
    code: responseItem.fieldGiftProductCode,
    type: 'gift_free',
    title: responseItem.title,
    price,
    imageUrl: api.getImageUrl('donations', responseItem.fieldGiftImage),
    imageAlt: responseItem.relationships.field_gift_image.data.meta.alt,
    amount: {
      value: responseItem.fieldGiftFreeAmount.number,
      currency: responseItem.fieldGiftFreeAmount.currency_code,
    },
    threshold: responseItem.fieldGiftFreeAmountThreshold.number,
    basketMessage: responseItem.fieldGiftFreeBasketMessage.value,
    enjoyMessage: responseItem.fieldGiftFreeEnjoyMessage.value,
  };
};

/**
 * Filters out free products and returns prepared basket messages based on
 * free product configuration.
 */
export const getOfferings = (state) => {
  const total = basketUtils.getTotal(
    basketUtils.getProducts(state.basket.products, state.currentCurrency),
    state.currentCurrency
  );

  const freeProducts = state.giftsFree.products;
  const currency = state.currentCurrency;

  const activeOfferings = freeProducts
    .filter(freeProduct =>
      // Filter by current currency.
      freeProduct.amount.currency === currency
      // Filter by non-empty offering configuration.
      && freeProduct.threshold && freeProduct.basketMessage && freeProduct.enjoyMessage
      // Total above threshold for this free product amount.
      && total >= freeProduct.threshold
    )
    .map((freeProduct) => {
      // Replace %MORE-AMOUNT% token by real value before rendering.
      const moreValue = freeProduct.amount.value - total;
      if (total < freeProduct.amount.value) {
        freeProduct.message = freeProduct.basketMessage.replace('%MORE-AMOUNT%', moreValue);
      }
      else {
        freeProduct.message = freeProduct.enjoyMessage;
      }
      return freeProduct;
    });

  return activeOfferings;
};
