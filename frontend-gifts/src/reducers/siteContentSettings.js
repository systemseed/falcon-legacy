export const siteContentSettings = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  data: {}
}, action) => {
  switch (action.type) {

    case 'GET_SITE_CONTENT_SETTINGS_PENDING':
      return {
        ...state,
        isPending: true,
      };

    case 'GET_SITE_CONTENT_SETTINGS_FULFILLED': {
      const data = action.payload.body.data[0];
      const tooltips = {};

      // Prepare tooltips configuration.
      if (data.fieldConfigCheckoutTooltips) {
        data.fieldConfigCheckoutTooltips.split('\n').forEach((item) => {
          const values = item.split('|');
          if (values.length === 2) {
            tooltips[values[0]] = values[1].replace('&#13;', '');
          }
        });
      }
      data.tooltips = tooltips;

      return {
        ...state,
        isPending: false,
        isFulfilled: true,
        data,
      };
    }

    case 'GET_SITE_CONTENT_SETTINGS_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };

    default:
      return state;
  }
};
