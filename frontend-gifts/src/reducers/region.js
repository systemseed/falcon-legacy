import * as regionUtils from '../utils/region';

export const regionPopupOff = (state = regionUtils.POPUP_UNKNOWN_STATE, action) => {
  switch (action.type) {
    case 'REGION_POPUP_DISABLE':
      return regionUtils.POPUP_DISABLED;
    case 'persist/REHYDRATE':
      if (action.payload && action.payload.regionPopupOff !== undefined) {
        return action.payload.regionPopupOff;
      }
      if (state === regionUtils.POPUP_UNKNOWN_STATE) {
        // Keep it enabled if the state is not clear after REHYDRATE.
        return regionUtils.POPUP_ENABLED;
      }

      return state;

    default:
      return state;
  }
};

export const region = (state = regionUtils.getDefaultRegionSettings(), action) => {
  switch (action.type) {

    case 'GET_REGION_SETTINGS_PENDING':
      return {
        ...state,
        isPending: true,
      };

    case 'GET_REGION_SETTINGS_FULFILLED': {
      // Response body will be either object with settings from backend or
      // null which means that Multi-regional feature is completely disabled.
      return {
        ...state,
        ...action.payload.body,
        isPending: false,
        isFulfilled: true
      };
    }

    case 'GET_REGION_SETTINGS_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };

    default:
      return state;
  }
};
