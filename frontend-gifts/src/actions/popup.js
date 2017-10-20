export const open = (title, body) => ({
  type: 'POPUP_OPEN',
  title,
  body,
});

export const close = () => ({
  type: 'POPUP_CLOSE'
});
