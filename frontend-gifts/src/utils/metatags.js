import _find from 'lodash/find';

export const getCustomPageMetatagsById = (pages, id) => (
  _find(pages, { id })
);
