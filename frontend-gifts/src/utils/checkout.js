import * as basketUtils from './basket';

// Get all checkout Gift cards items as an array.
export const getGiftCardItems = (state) => {
  if (state.checkout.cards) {
    return Object.keys(state.checkout.cards).map(cardIndex => state.checkout.cards[cardIndex]);
  }

  return [];
};

// Checks is Gift cards part of the checkout form is validated.
const isCheckoutCardsValidated = (state) => {
  if (state.basket.type !== 'gift') {
    return true;
  }

  let isValidated = true;

  getGiftCardItems(state).forEach((card) => {
    if (card.type === 'email' && !card.validated) {
      isValidated = false;
    }
  });

  return (isValidated === true);
};

const isCheckoutFormValidated = state =>
  Object.keys(state.checkout.form).reduce(
    (value, formName) => (value && state.checkout.form[formName].validated),
    true
  );


// Checks checkout data in state and returns TRUE if the form can be submitted.
export const isCheckoutValidated = state =>
  isCheckoutFormValidated(state) && isCheckoutCardsValidated(state);

// Determine if checkout process is competed.
export const isCheckoutComplete = (state) => {
  if (state.basket.type === 'gift') {
    return !!state.checkout.order.order_id && state.checkout.cardsSent;
  }

  return !!state.checkout.order.order_id;
};

export const getOrderItems = (state) => {
  // Prepare an object keyed by product id.
  const productsById = basketUtils.getProducts(state.basket.products, state.currentCurrency)
    .reduce((obj, product) => {
      obj[product.id] = { ...product, quantityEmail: 0, quantityPost: 0 };
      return obj;
    }, {});

  // Walk through Gift cards and count post/email items in the basket.
  getGiftCardItems(state).forEach((card) => {
    if (card.type === 'email') {
      productsById[card.product.id].quantityEmail++;
    }
    else {
      productsById[card.product.id].quantityPost++;
    }
  });

  // Prepare final order items array.
  const orderItems = [];
  Object.keys(productsById).forEach((productId) => {
    const product = productsById[productId];

    if (product.quantityPost === 0 && product.quantityEmail === 0) {
      // Add items without delivery format (corporate/custom donation).
      orderItems.push({
        ...product.data,
        quantity: product.quantity,
      });
    }
    else {
      if (product.quantityPost > 0) {
        // Add postal Gifts.
        orderItems.push({
          ...product.data,
          quantity: product.quantityPost,
          field_gift_delivery_format: 'Post'
        });
      }
      if (product.quantityEmail > 0) {
        // Add email Gifts.
        orderItems.push({
          ...product.data,
          quantity: product.quantityEmail,
          field_gift_delivery_format: 'Email'
        });
      }
    }
  });

  return orderItems;
};
