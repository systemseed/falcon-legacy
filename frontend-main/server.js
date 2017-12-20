const compression = require('compression');
const express = require('express');
const nextjs = require('next');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

// Override env vars for platform.sh environment.
if (process.env.PLATFORM_PROJECT) {

  // Load platform.sh config.
  const config = require('platformsh').config();

  // Override environment port.
  process.env.PORT = config.port;
  console.log('PORT: ' + process.env.PORT);
  const handle = app.getRequestHandler()
  for (let url in config.routes) {
    let route = config.routes[url];
    if (route.original_url === 'https://main.{default}/') {
      process.env.BASE_URL = url;
    }
  }

  console.log('BASE URL: ' + process.env.BASE_URL);
}
else {
  // Load environment variables from .env (for production) or
  // .env.local (for local development) file.
  let dotEnvFilePath = process.env.NODE_ENV !== 'production' ? './.env.local' : './.env';
  require('dotenv').config({
    path: dotEnvFilePath,
  });
}

const dev = process.env.NODE_ENV !== 'production';
const app = nextjs({ dev });
const handler = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    // Serve gzipped content where possible.
    server.use(compression());

    // Send robots.txt file from /static folder.
    const options = {
      root: __dirname + '/static/',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      }
    };

    // Set browser caching for all static files.
    server.use('/static', express.static(__dirname + '/static', {
      maxAge: '7d'
    }));

    server.use(handler).listen(process.env.PORT);
  });
