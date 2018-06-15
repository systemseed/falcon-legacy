import thunkMiddleware from 'redux-thunk';
import { autoRehydrate } from 'redux-persist';
import createMigration from 'redux-persist-migrate';
import promiseMiddleware from 'redux-promise-middleware';
import { createMiddleware } from 'redux-beacon';
import { GoogleTagManager } from 'redux-beacon/targets/google-tag-manager';
import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import reducers from '../reducers';
import config from '../config';
import eventDefinitionsMap from '../analytics';
import history from './history';


// Store configuration function.
// Used by both server and client.
//
// - Add redux-thunk for dispatching async functions (API calls).
// - Add redux-persist to make some parts of store persistent.
// - Add logger for nice output of all dispatching actions.
// - Add promiseMiddleware for autogeneration of dispatching action types based on response from the server.
const configureStore = (initialState = {}) => {
  let middleware;

  // Create analytics (redux-beacon) middleware.
  const analyticsMiddleware = createMiddleware(eventDefinitionsMap, GoogleTagManager);

  if (typeof window !== 'undefined' && window.dataLayer) { // eslint-disable-line no-undef
    // Build the middleware for intercepting and dispatching navigation actions.
    const routeMiddleware = routerMiddleware(history);

    // Initialize with GTM.
    if (config.mode === 'test') {
      middleware = applyMiddleware(promiseMiddleware(), thunkMiddleware, routeMiddleware, analyticsMiddleware, logger);
    }
    else {
      middleware = applyMiddleware(promiseMiddleware(), thunkMiddleware, routeMiddleware, analyticsMiddleware);
    }
  }
  else {
    // Initialize without GTM.
    if (config.mode === 'test') { // eslint-disable-line no-lonely-if
      middleware = applyMiddleware(promiseMiddleware(), thunkMiddleware, logger);
    }
    else {
      middleware = applyMiddleware(promiseMiddleware(), thunkMiddleware);
    }
  }

  const migrationsManifest = {
    // Migration 1: wipe stale baskets after gifts cards code refactoring.
    1: (state) => {
      if (state.app && state.app.version) {
        // Do nothing for already migrated apps.
        return state;
      }
      return { ...state, basket: undefined, cards: undefined };
    },
    2: (state) => {
      if (state.app && state.app.version && state.app.version < 2) {
        // Clean up older baskets and cards after fix of broken reducer.
        return { ...state, basket: undefined, cards: undefined };
      }
      return state;
    }
  };

  const migration = createMigration(migrationsManifest, 'app');

  const store = createStore(
    reducers,
    initialState,
    compose(
      middleware,
      migration,
      autoRehydrate()
    )
  );

  return store;
};

export default configureStore;
