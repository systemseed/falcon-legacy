import _map from 'lodash/map';
import api from '../lib/api';

/**
 * Featured Images reducer.
 */
export const featuredImages = (state = {
  isPending: false,
  isFulfilled: false,
  isError: false,
  list: [],
}, action) => {
  switch (action.type) {

    case 'FEATURED_IMAGES_FETCH_PENDING':
      return {
        isPending: true
      };

    case 'FEATURED_IMAGES_FETCH_FULFILLED':

      const images = action.payload.body.data;
      const processedImages = _map(images, image => ({
        'uuid': image.uuid,
        'url': api.getImageUrl('gifts', image.fieldFeaturedImage),
        'alt': image.relationships.field_featured_image.data.meta.alt,
      }));

      return {
        ...state,
        isPending: false,
        isFulfilled: true,
        list: processedImages,
      };

    case 'FEATURED_IMAGES_FETCH_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true,
      };

    default:
      return state;
  }
};
