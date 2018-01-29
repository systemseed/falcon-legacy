const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const sass = require('node-sass');
const nextjs = require('next');
const routes = require('./routes');
const auth = require('express-basic-auth');
const globImporter = require('node-sass-glob-importer');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

// Override env vars for platform.sh environment.
if (process.env.PLATFORM_PROJECT) {

  // Load platform.sh config.
  const config = require('platformsh').config();

  // Override environment port.
  process.env.PORT = config.port;

  for (let url in config.routes) {
    let route = config.routes[url];
    if (route.original_url === 'https://main.{default}/') {
      process.env.BASE_URL = url.replace(/\/$/, ""); // Remove railing slash.
    }
  }
}
else {
  // Load environment variables from .env (for production) or
  // .env.local (for local development) file.
  let dotEnvFilePath = process.env.NODE_ENV !== 'production' ? './.env.local' : './.env';
  require('dotenv').config({
    path: dotEnvFilePath,
  });
}

// Log some basic data.
console.log('BASE URL: ' + process.env.BASE_URL);
console.log('PORT: ' + process.env.PORT);

const dev = process.env.NODE_ENV !== 'production';
const app = nextjs({ dev });
const handler = routes.getRequestHandler(app);

app.prepare()
  .then(() => {
    const server = express();

    // Support HTTP AUTH.
    // const CW_AUTH = process.env.CW_AUTH;
    // if (CW_AUTH && CW_AUTH !== '0') {
    //   const httpAuth = CW_AUTH.split(':');
    //
    //   server.use(auth({
    //     users: { [httpAuth[0]]: httpAuth[1] },
    //     challenge: true
    //   }));
    // }

    // Serve gzipped content where possible.
    server.use(compression());

    // Enable logging.
    server.use(morgan('combined'));

    // Add route to serve compiled SCSS from /assets/{build id}/main.css
    // Note: This is only used in production, in development css is inline.
    const sassResult = sass.renderSync({ file: './styles/theme.scss', outputStyle: 'compressed', importer: globImporter() });
    server.get('/assets/:id/main.css', (req, res) => {
      res.setHeader('Content-Type', 'text/css');
      res.setHeader('Cache-Control', 'public, max-age=2592000');
      res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());
      res.send(sassResult.css);
    });

    // Set browser caching for all static files.
    server.use('/static', express.static(__dirname + '/static', {
      maxAge: '7d'
    }));

    server.use(handler).listen(process.env.PORT);
  });
