/**
 * @public
 * Popup reducer.
 *
 * @param { bool } state True means popup open, false means closed
 * @param { string } action One of DIALOG_OPEN or DIALOG_CLOSED
 */
export const popup = (state = {
  isOpened: false,
  title: '',
  body: null,
}, action) => {
  switch (action.type) {

    case 'POPUP_OPEN':
      const { title, body } = action;
      return {
        isOpened: true,
        title,
        body,
      };

    case 'POPUP_CLOSE':
      return {
        isOpened: false
      };

    default:
      return state;
  }
};
