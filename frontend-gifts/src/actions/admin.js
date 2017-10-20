export const initGiftForm = product => ({
  type: 'EDIT_GIFT_INIT',
  product
});

export const unmountGiftForm = () => ({
  type: 'EDIT_GIFT_UNMOUNT'
});

export const editGiftForm = formData => ({
  type: 'EDIT_GIFT_FORM_DATA',
  formData
});
