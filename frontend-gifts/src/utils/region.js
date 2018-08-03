import config from '../config';

export const POPUP_UNKNOWN_STATE = -1;
export const POPUP_DISABLED = 0;
export const POPUP_ENABLED = 1;

// Returns true if current region is GB.
export const isRegionGB = () => config.region === 'gb';

// Returns default multi-regional settings.
export const getDefaultRegionSettings = () => ({
  isPending: false,
  isFulfilled: false,
  isError: false,
  // All features are disabled by default.
  enable_popup: false,
  enable_region_switcher: false,
  regions: [],
  user_suggested_region: '',
  popup_title: '',
  popup_body: '',

});

// Returns region by the given referrer, or undefined if not found.
export const findRegionByReferrer = (regions, referrerUrl) => (
  regions.find(region =>
    // Success if a given URL starts from region base URL.
    referrerUrl.search(region.url) === 0
  )
);

// Returns region by the given code, or undefined if not found.
export const findRegionByCode = (regions, code) => (
  regions.find(region => code === region.code)
);
