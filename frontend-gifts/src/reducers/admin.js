import { combineReducers } from 'redux';

const editGift = (state = false, action) => {
  switch (action.type) {

    case 'EDIT_GIFT_INIT':
      return {
        id: action.product.id,
        formData: {
          title: action.product.title,
          field_gift_annotation: { value: action.product.annotation },
          field_gift_description: { value: action.product.description },
          category_id: action.product.categoryId
        },
        isPending: false,
        isFulfilled: false,
        isError: false
      };

    case 'EDIT_GIFT_UNMOUNT':
      return false;

    case 'EDIT_GIFT_FORM_DATA':
      return {
        ...state,
        formData: action.formData
      };

    case 'PATCH_PRODUCT_GIFT_PENDING':
      return {
        ...state,
        isPending: true
      };

    case 'PATCH_PRODUCT_GIFT_FULFILLED':
      return {
        ...state,
        isPending: false,
        isFulfilled: true
      };

    case 'PATCH_PRODUCT_GIFT_REJECTED':
      return {
        ...state,
        isPending: false,
        isError: true
      };
    default:
      return state;
  }
};

export default combineReducers({
  editGift
});
