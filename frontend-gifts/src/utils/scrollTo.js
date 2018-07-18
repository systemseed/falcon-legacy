const easeInOutQuad = (t, b, c, d) => {
  // eslint-disable-next-line
  t /= d / 2;
  if (t < 1) return ((c / 2) * t * t) + b;
  // eslint-disable-next-line
  t -= 1;
  return ((-c / 2) * ((t * (t - 2)) - 1)) + b;
};

/**
 * Scrolls user to the element.
 *
 * Based on https://gist.github.com/andjosh/6764939#gistcomment-2553779
 */
const scrollTo = (element, to = 0, duration = 400, callback = () => { }) => {
  const start = element.scrollTop;
  const change = to - start;
  const increment = 20;
  let currentTime = 0;

  const animateScroll = (() => {
    currentTime += increment;

    element.scrollTop = easeInOutQuad(currentTime, start, change, duration);

    if (currentTime < duration && element.scrollTop !== to) {
      setTimeout(animateScroll, increment);
    }
    else {
      callback();
    }
  });

  animateScroll();
};

/**
 * Scroll user to the element.
 */
export const scrollToElement = (
  elementId,
  scrollableAreaId = null,
  desiredElementPosition = 120, // default gap of 120px for the sticky header.
  callback = () => { },
) => {
  setTimeout(() => {
    // Get scrollable element.
    const element = document.getElementById(elementId); // eslint-disable-line no-undef
    if (!element) {
      return;
    }
    const elementRect = element.getBoundingClientRect();

    // Get scrollable area.
    let scrollableArea = null;
    if (scrollableAreaId !== null) {
      scrollableArea = document.getElementById(scrollableAreaId); // eslint-disable-line no-undef
    }
    else {
      scrollableArea = document.scrollingElement || document.documentElement; // eslint-disable-line no-undef
    }
    if (!scrollableArea) {
      return;
    }
    const to = (scrollableArea.scrollTop + elementRect.top) - desiredElementPosition;

    scrollTo(scrollableArea, to);
    callback(element);
  }, 50);
};
