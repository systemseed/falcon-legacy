// Simply skip all css/scss because server doesn't work with them out of the box.
require('ignore-styles');

// Basic webserver imports.
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const auth = require('express-basic-auth');

// Server works with source files, not compiled version.
// We need to transform modern React syntax to something that node.js supports.
require('babel-register')({
  ignore: /\/(build|node_modules)\//,
  presets: ['env', 'react-app']
});

// Import main renderer function.
const reactRenderer = require('./reactRenderer');
const sitemap = require('./sitemap');
const robotstxt = require('./robotstxt');

// Create web server.
const app = express();

// Support Gzip.
app.use(compression());

// Support HTTP AUTH.
const CW_AUTH = process.env.CW_AUTH;

if (CW_AUTH && CW_AUTH !== '0') {
  const httpAuth = CW_AUTH.split(':');

  app.use(auth({
    users: { [httpAuth[0]]: httpAuth[1] },
    challenge: true,
    realm: 'Concern Gifts'
  }));
}


// Enable basic logger.
// On Platform, you can find logs in /app/run/logs.
app.use(morgan('combined'));

// Index route which is responsible for all non-static routes.
const router = express.Router();
const index = router.get('/', reactRenderer);
app.use('/', index);

// Generates sitemap.xml file.
app.get('/sitemap.xml', sitemap);

// Generates robots.txt file.
app.get('/robots.txt', robotstxt);

// Serve static files that are not served by Nginx.
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Fallback to React renderer for other paths.
app.use('/', reactRenderer);

module.exports = app;
