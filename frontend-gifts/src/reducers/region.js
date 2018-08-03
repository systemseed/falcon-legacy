import * as regionUtils from '../utils/region';

// IMPORTANT NOTE: an object is used for popup status flag to avoid hard reset
// of the state by REHYDRATE action.
export const regionPopupOff = (state = {
  status: regionUtils.POPUP_UNKNOWN_STATE
}, action) => {
  switch (action.type) {
    case 'REGION_POPUP_DISABLE':
      return { status: regionUtils.POPUP_DISABLED };
    case 'persist/REHYDRATE':
      // Instead simple restore apply some logic.
      if (action.payload
        && action.payload.regionPopupOff !== undefined
        && action.payload.regionPopupOff.status === regionUtils.POPUP_DISABLED) {
        // Popup was previously disabled in local storage.
        return { status: regionUtils.POPUP_DISABLED };
      }

      if (state.status === regionUtils.POPUP_UNKNOWN_STATE) {
        // Keep it enabled if the state is not clear after REHYDRATE.
        return { status: regionUtils.POPUP_ENABLED };
      }

      return { status: state.status };
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
