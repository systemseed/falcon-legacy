
// View detail produc page.
export const ecommerceDetail = product => ({
  type: 'ANALYTICS_ECOMMERCE_DETAIL',
  product
});

// Click Checkout button.
export const ecommerceCheckout = () => ({
  type: 'ANALYTICS_ECOMMERCE_CHECKOUT',
});

// Complete purchase.
export const ecommercePurchase = () => ({
  type: 'ANALYTICS_ECOMMERCE_PURCHASE',
});
