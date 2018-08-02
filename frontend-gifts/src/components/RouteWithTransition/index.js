import React, { PropTypes } from 'react';
import { Route } from 'react-router-dom';
import PopupContainer from '../../containers/PopupContainer';
import GlobalFooter from '../../components/GlobalFooter';
import MessageBarContainer from '../../containers/MessageBarContainer';
import GlobalHeader from '../../components/GlobalHeader';
import RegionPopup from '../../components/RegionPopup';

// <Route /> with global page elements rendered.
const PageRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <div className="page-content">
        <GlobalHeader {...props} />
        <MessageBarContainer />
        <Component {...props} />
        <GlobalFooter />
        {/* POPUP CONTAINER SITS HERE AND WAITS FOR YOU TO OPEN IT */}
        <PopupContainer />
        {/* Multi-regional popup */}
        <RegionPopup />
      </div>
    )}
  />
);

PageRoute.propTypes = {
  component: PropTypes.func.isRequired
};

export default PageRoute;
