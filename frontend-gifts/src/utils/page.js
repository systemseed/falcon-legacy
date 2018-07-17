import _find from 'lodash/find';
import config from '../config';
import api from '../lib/api';

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

/**
 * Helper to map page response data to store.
 */
export const mappedPageItem = (page) => {
  // Add Gifts domain to all image urls.
  const bodyHtml = page.attributes.body
    ? processImages(page.attributes.body.value)
    : '';

  const featuredImageId = (page.relationships.field_featured_image && page.relationships.field_featured_image.data)
    ? page.relationships.field_featured_image.data.id
    : null;

  const blocks = [];

  page.fieldParagraphBlocks.forEach((block) => {
    switch (block.type.id) {

      case 'subheading':
        blocks.push({
          uuid: block.uuid,
          type: block.type.id,
          title: block.fieldTitle,
        });
        break;

      case 'info_card':
        blocks.push({
          uuid: block.uuid,
          type: block.type.id,
          title: block.fieldTitle,
          description: block.fieldDescription
            ? block.fieldDescription.value
            : '',
          image: {
            src: api.getImageUrl('gifts', block.fieldImage, 'square_420'),
            alt: api.getImageAlt(
              block.relationships.field_image
            ),
          }
        });
        break;
      default:
    }
  });

  return {
    ...page.attributes,
    bodyHtml,
    featuredImageId,
    blocks
  };
};

/**
 * Generate very trivial table of contents.
 * Used on FAQ page.
 */
export const generateTableOfContents = (html) => {
  const tableOfContents = [];
  // Assign html ids to heading tags and add an item for each heading into
  // tableOfContents array.
  const content = html.replace(/<h(\d)>(.+?)<\/h\d>/gi, (match, p1, p2) => {
    const id = `ref${tableOfContents.length + 1}`;
    tableOfContents.push({ id, label: p2 });
    return `<h${p1} id="${id}">${p2}</h${p1}>`;
  });

  return {
    tableOfContents,
    content
  };
};
