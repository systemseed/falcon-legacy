import _find from 'lodash/find';

export const get = (featuredImages, uuid) => (
  _find(featuredImages, { uuid })
);
