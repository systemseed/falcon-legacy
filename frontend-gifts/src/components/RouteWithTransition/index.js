import React from 'react';
import { Route } from 'react-router-dom';
import PopupContainer from '../../containers/PopupContainer';
import GlobalFooter from '../../components/GlobalFooter';

// <Route /> with global page elements rendered.
const PageRoute = ({ component: Component, ...props }) => (
  <Route
    {...props}
    render={props => (
      <div className="page-content">
        <Component {...props} />
        <GlobalFooter />
        {/* POPUP CONTAINER SITS HERE AND WAITS FOR YOU TO OPEN IT */}
        <PopupContainer />
      </div>
    )}
  />
);

export default PageRoute;
