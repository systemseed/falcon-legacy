const path = require('path');
const fs = require('fs');

// Import all required libs to render app on server.
const React = require('react');
const { Helmet } = require('react-helmet');
const { Provider } = require('react-redux');
const { StaticRouter } = require('react-router');
const { renderToString } = require('react-router-server');

const { default: configureStore } = require('../src/lib/configureStore');
const { default: App } = require('../src/App');

// On any request, this function renders <App /> and returns modified index.html to the client.
module.exports = function reactRenderer(req, res) {
  // Instead of building HTML from scratch, use CRA file from /build/index.html as a template.
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err);
      return res.status(404).end();
    }
    if (req.url) {
      // We initiate new store on every request. For simplicity, we don't share/cache state between requests.
      const store = configureStore();
      // Context is the place where app can share some data, URL of redirect for example.
      const context = {};

      // This is server version of app. Client version can be found in /src/index.js.
      // The main change is to use StaticRouter and pass request URL into it.
      const markup = (
        <Provider store={store}>
          <StaticRouter
            location={req.url}
            context={context}
          >
            <App />
          </StaticRouter>
        </Provider>
      );

      // Enhanced renderToString function from react-router-server knows how to "wait" for components
      // to be fully loaded.
      // See FeaturedImageContainer component for example implementation.
      renderToString(markup)
        // This promise passes html and state values.
        // We don't use state from react-router-server because we use Redux store instead.
        .then(({ html }) => {
          if (context.url) {
            res.redirect(301, context.url);
          }
          else {
            // Insert rendered HTML in React root.
            let renderedApp = htmlData.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

            // Capture Redux store after rendering.
            const renderedReduxState = JSON.stringify(store.getState()).replace(/</g, '\\u003c');
            // Pass Redux store as a global variable.
            renderedApp = renderedApp.replace('<script>window.__INITIAL_STATE__={}</script>', `<script>window.__INITIAL_STATE__ = ${renderedReduxState};</script>`);

            // Render helmet metatags.
            const helmet = Helmet.renderStatic();
            let title = helmet.title.toString();
            let meta = helmet.meta.toString();

            // Remove Default title from the HTML.
            renderedApp = renderedApp.replace(/<title(.*)\/title>/g,"");

            // Replace Default metatags to Generated.
            renderedApp = renderedApp.replace('<meta charset="utf-8">', `<meta charset="utf-8">${title}${meta}`);

            // Send the response.
            res.send(renderedApp);
          }
        })
        .catch(err => console.error(err));
    }
  });
};
