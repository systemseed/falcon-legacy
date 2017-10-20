export function show(message, options) {
  return {
    type: 'MESSAGE_SHOW',
    message,
    options
  };
}

export function hide() {
  return {
    type: 'MESSAGE_HIDE'
  };
}
