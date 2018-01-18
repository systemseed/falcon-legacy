import React from 'react';
import PropTypes from 'prop-types';

/**
 * Based on https://github.com/themeteorchef/react-sticky-scroll/blob/master/imports/ui/components/sticky.js
 * with bug fixes in row:12-13.
 */
class Sticky extends React.Component {
  componentDidMount() {
    const setInitialHeights = (elements) => {
      [].forEach.call(elements, (sticky) => {
        const top = document.documentElement.scrollTop || document.body.scrollTop;
        const elementTop = sticky.getBoundingClientRect().top;
        sticky.setAttribute('data-sticky-initial', top + elementTop);
      });
    };

    const stickies = document.querySelectorAll('[data-sticky]');
    setInitialHeights(stickies);

    document.addEventListener('scroll', () => {
      const top = document.documentElement.scrollTop || document.body.scrollTop;
      const bottom = document.documentElement.scrollHeight || document.body.scrollHeight;

      [].forEach.call(stickies, (sticky) => {
        const stickyInitial = parseInt(sticky.getAttribute('data-sticky-initial'), 10);
        const stickyEnter = parseInt(sticky.getAttribute('data-sticky-enter'), 10) || stickyInitial;
        const stickyExit = parseInt(sticky.getAttribute('data-sticky-exit'), 10) || bottom;

        if (top >= stickyEnter && top <= stickyExit) {
          sticky.classList.add('sticky');
        } else {
          sticky.classList.remove('sticky');
        }
      });
    });
  }

  render() {
    const { className, enter, exit, children } = this.props;
    return (<div
      className={`Sticky ${className}`}
      data-sticky
      data-sticky-enter={enter}
      data-sticky-exit={exit}
    >
      {children}
    </div>);
  }
}

Sticky.propTypes = {
  className: PropTypes.string,
  enter: PropTypes.string,
  exit: PropTypes.string,
  children: PropTypes.node,
};

export default Sticky;