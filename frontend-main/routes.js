const routes = module.exports = require('next-routes')();

// @see https://github.com/fridays/next-routes
// Additional dynamic routes.
// 'route name', 'alias', 'page' to process in /pages folder.
routes
  .add('landing_demo', '/donation-landing-page', 'landing');