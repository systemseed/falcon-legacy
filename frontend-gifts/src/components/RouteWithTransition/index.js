import React from 'react';
import { Route } from 'react-router-dom';
import { RouteTransition } from 'react-router-transition';
import PopupContainer from '../../containers/PopupContainer';
import GlobalFooter from '../../components/GlobalFooter';

const RouteWithTransition = ({ component: Component, ...rest }) => (
  <div className="page-content">
    <Route
      {...rest} render={props => (
      <RouteTransition
        pathname={rest.path}
        atEnter={{ opacity: 0 }}
        atLeave={{ opacity: 2 }}
        atActive={{ opacity: 1 }}
        mapStyles={(styles) => {
          if (styles.opacity > 1) {
            return { display: 'none' };
          }
          return { opacity: styles.opacity };
        }}
      >
        <Component {...props} />
        <GlobalFooter />
        {/* POPUP CONTAINER SITS HERE AND WAITS FOR YOU TO OPEN IT */}
        <PopupContainer />
      </RouteTransition>
    )}
    />
  </div>
);

export default RouteWithTransition;
