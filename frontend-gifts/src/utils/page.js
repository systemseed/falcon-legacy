import _find from 'lodash/find';
import config from '../config';

export const getPage = (pages, uuid) => (
  _find(pages, { uuid })
);

export const processImages = content => (
  // These lines search for <img src="/sites.."/> tags
  // in the content and add backend url to each.
  // This is more like a workaround for a good solution,
  // but it works for the current case.
  content.replace(/(<img.+?)src="(\/sites.+)"/g, `$1src="${config.gifts}$2"`)
    // Support image alignment from Drupal WYSIWYG.
    .replace(/data-align=/g, 'align=')
);
