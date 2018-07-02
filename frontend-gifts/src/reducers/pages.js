import * as pageUtils from '../utils/page';
import config from '../config';

export const pages = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  list: []
}, action) => {
  switch (action.type) {

    case 'GET_PAGES_PENDING':
      return {
        ...state,
        isPending: true,
      };

    case 'GET_PAGES_FULFILLED': {
      const data = action.payload.body.data;
      const list = [];

      data.forEach((page) => {
        if (page.attributes.body && page.attributes.body.value) {
          // Add Gifts domain to all image urls.
          page.attributes.body.value = pageUtils.processImages(page.attributes.body.value);
        }

        if (page.relationships.field_featured_image && page.relationships.field_featured_image.data) {
          page.attributes.field_featured_image = page.relationships.field_featured_image.data.id;
        }


        // Adding Paragraph Blocks values to page.
        if (page.fieldParagraphBlocks.length > 0) {
          const paragraphBlocks = page.fieldParagraphBlocks;
          page.attributes.paragraphBlocks = {
            infoCards: [],
          };

          paragraphBlocks.forEach((paragraphBlock) => {
            const paragraphRelationship = page.relationships.field_paragraph_blocks.data.filter(relationship => relationship.id === paragraphBlock.uuid);

            const paragraphBlockValues = {
              uuid: paragraphBlock.uuid,
              type: paragraphRelationship.type,
              title: paragraphBlock.fieldTitle,
              description: pageUtils.processImages(paragraphBlock.fieldDescription.value),
            };

            if (Object.prototype.hasOwnProperty.call(paragraphBlock, 'fieldImage')) {
              paragraphBlockValues.image = config.gifts + paragraphBlock.fieldImage.uri.url;
            }

            page.attributes.paragraphBlocks.infoCards.push(paragraphBlockValues);
          });
        }

        list.push(page.attributes);
      });

      return {
        ...state,
        isPending: false,
        isFulfilled: true,
        list
      };
    }

    case 'GET_PAGES_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };

    default:
      return state;
  }
};
