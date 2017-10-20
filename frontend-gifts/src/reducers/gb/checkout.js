
// Based on ../ie/checkout.js, added giftaid values additionally.
export const checkoutForm = (state = {
  profile: { formData: {}, validated: false },
  address: { formData: {}, validated: false },
  optins: { formData: {}, validated: false },
  eventcode: { formData: {}, validated: false },
  giftaid: { formData: {}, validated: false },
}, action) => {
  switch (action.type) {
    case 'CHECKOUT_FORM_CHANGED':
      return {
        ...state,
        [action.formName]: {
          formData: action.formData,
          validated: action.validated
        }
      };
    case 'CHECKOUT_COMPLETE':
    case 'CHECKOUT_FORM_RESET':
      // Clean up.
      return {
        profile: { formData: {}, validated: false },
        address: { formData: {}, validated: false },
        optins: { formData: {}, validated: false },
        eventcode: { formData: {}, validated: false },
        giftaid: { formData: {}, validated: false },
      };
    default:
      return state;
  }
};
