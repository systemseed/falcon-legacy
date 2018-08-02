import request from 'superagent';
import config from '../config';

/**
 * Dispatches request to fetch multi-regional settings.
 */
export const getRegionSettings = () => ({
  type: 'GET_REGION_SETTINGS',
  payload: request
    .get(`${config.backend}/v1/gifts/falcon/multiregion`)
});

/**
 * Disable multi-regional popup for this user.
 */
export const disablePopup = () => ({
  type: 'REGION_POPUP_DISABLE'
});
