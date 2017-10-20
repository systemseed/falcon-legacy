import config from '../config';

// Returns true if current region is GB.
export const isRegionGB = () => {
  return config.region === 'gb';
};
