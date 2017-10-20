import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { ConnectedRouter } from 'react-router-redux';

import history from './lib/history';

// Add support of Internationalization API for safari browser https://github.com/andyearnshaw/Intl.js.
import 'intl';
import 'intl/locale-data/jsonp/en';

// To fix `Can't find variable: Symbol issue`: https://github.com/babel/babel/issues/711#issuecomment-141398678
import 'babel-polyfill';

import configureStore from './lib/configureStore';
import App from './App';

// Create store on client side.
const initialState = window.__INITIAL_STATE__; // eslint-disable-line
const store = configureStore(initialState);

// Make some parts of store persistent.
persistStore(store, {
  whitelist: [
    'auth',
    'basket',
    'currentCurrency',
    'isPersistentReady',
  ]
});

// Start rendering.
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter store={store} history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') // eslint-disable-line no-undef
);
