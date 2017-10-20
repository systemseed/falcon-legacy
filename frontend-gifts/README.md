# Frontend app for Falcon Gifts

## Quick start

```
yarn install
yarn run start
```

Frontend app is based on Create React App. 
You can follow their awesome [README.md](https://github.com/facebookincubator/create-react-app/blob/v0.9.5/packages/react-scripts/template/README.md#available-scripts) for guidance.

Please note that current versions of react-scripts is 0.9.5.

## ESLint

The app contains `.eslintrc.json` for ESLint validation. For better code quality, please configure your editor to highlight and fix ESLint warnings on the fly.

## Configuration

See `/src/config.js` for available configuration.   
For local development server, you can override configuration directly in `/public/config/index.js`. 
On Platform.sh, this file is unique for each environment. See `platform-deploy.js` script for details.

## State management

In most cases, the app uses Redux to manage components state. Smaller components can use React built-in state instead of connecting to Redux.

## Asynchronous actions

We use [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware) for asynchronous API calls.  
For some non-api asynchronous actions, [redux-thunk](https://github.com/gaearon/redux-thunk) is used.

## API

AJAX calls are made with help of [superagent](https://github.com/visionmedia/superagent) and [superagent-jsonapify](https://github.com/alex94puchades/superagent-jsonapify).

## Misc tools

We use ES6 syntax with small help from [lodash](https://lodash.com/) library. You can find examples in `/src/utils` folder.

## GTM and other HTML snippets
See `/code-snippets/README.md`.

## Server side rendering
We use custom server side rendering configuration which is compatible with our current frontend stack.

### Quick start
```
yarn run build
yarn run start:server
```

**TODO: update for Docker installation.**

You can now visit http://localhost:3001 to test SSR on local. Logs will be outputted directly to stdout.

On Platform.sh, [PM2](https://github.com/Unitech/pm2) is used to run node server. You can find server logs in `/var/run/logs`.

### Known limitations
1. Assets import isn't supported. CSS/images import doesn't work. To fix it custom webpack configuration is required.
2. To render components that rely on API data, component should be wrapped into [react-router-server](https://github.com/gabrielbull/react-router-server#usage-with-redux). Otherwise component will be rendered with empty data and Redux state might contain incomplete/broken data.

### How it works
1. Node server listens to all incoming requests: `/server/index.js`.
2. User requests the page: `'/corporate'`.
3. Node server 
  - imports source code of the frontend app
  - uses react server libraries to render the app
  - reads `/build/index.html`
  - replaces `<div id="root"></div>` with rendered string
  - injects initial Redux store as a global variable `__INITIAL_STATE__`
  - sends result HTML back to user.
4. User receives file with inital HTML and state.
5. Frontend Redux store consumes __INITIAL_STATE__.
6. Frontend React validates data in `<div id="root"></div>` and completes rendering of missing parts if any.
7. Frontend React manages all further interactions with the page.

