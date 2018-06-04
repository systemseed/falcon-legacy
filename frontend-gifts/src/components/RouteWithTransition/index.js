import React, { PropTypes } from 'react';
import { Route } from 'react-router-dom';
import PopupContainer from '../../containers/PopupContainer';
import GlobalFooter from '../../components/GlobalFooter';

// <Route /> with global page elements rendered.
const PageRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <div className="page-content">
        <Component {...props} />
        <GlobalFooter/>
        {/* POPUP CONTAINER SITS HERE AND WAITS FOR YOU TO OPEN IT */}
        <PopupContainer/>
      </div>
    )}
  />
);

PageRoute.propTypes = {
  component: PropTypes.func.isRequired
};

export default PageRoute;
