/**
 * @public
 * Message Bar reducer.
 */
export const messageBar = (state = {
  isVisible: false,
  message: '',
  options: defaultOptions,
}, action) => {
  switch (action.type) {

    case 'MESSAGE_SHOW':
      return {
        isVisible: true,
        message: action.message,
        options: {...defaultOptions, ...action.options},
      };

    case 'MESSAGE_HIDE':
      return {
        ...state,
        isVisible: false
      };

    default:
      return state;
  }
};

// Defines default options.
const defaultOptions = {
  type: 'status',
  timeout: 2000,
  link: '',
};
