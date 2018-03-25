import config from '../config';

// Returns true if current region is GB.
export const isRegionGB = () => config.region === 'gb';
