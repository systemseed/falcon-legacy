export const contactForm = (state = {
  isPending: false,
  isFulfilled: false,
  formData: {},
  errorMessage: ''
}, action) => {
  switch (action.type) {
    case 'POST_CONTACT_FORM_PENDING':
      return {
        ...state,
        isPending: true,
        isFulfilled: false,
        errorMessage: '',
        formData: action.meta.formData
      };

    case 'POST_CONTACT_FORM_FULFILLED':
      return {
        ...state,
        isPending: false,
        isFulfilled: true,
        errorMessage: '',
        formData: {},
      };

    case 'POST_CONTACT_FORM_REJECTED': {
      let errorMessage;
      if (action.error) {
        errorMessage = action.payload.message;
      }
      else {
        errorMessage = action.payload.response.body.message;
      }

      return {
        ...state,
        isPending: false,
        isFulfilled: false,
        errorMessage,
      };
    }
    default:
      return state;
  }
};
