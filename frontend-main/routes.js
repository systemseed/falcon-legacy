const routes = module.exports = require('next-routes')();

// @see https://github.com/fridays/next-routes
// Additional dynamic routes.
// 'route name', 'alias', 'page' to process in /pages folder.
// Use /private/ prefix to hide access to the page with http auth.
//
routes
  .add('landing_page', '/private/landing-page', 'landing-page');