import React from 'react';
import { withRouter } from 'react-router';

// See https://reacttraining.com/react-router/web/guides/scroll-restoration.
class ScrollToTop extends React.Component {

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0); // eslint-disable-line no-undef
    }
  }

  render() {
    return this.props.children;
  }
}

ScrollToTop.propTypes = {
  location: React.PropTypes.object,
  children: React.PropTypes.node,
};

export default withRouter(ScrollToTop);
