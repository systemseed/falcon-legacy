/* eslint-disable */

// NPM BUILD SCRIPT FOR PLATFORM.SH
// Pass correct API bus URL to the frontend app.

const fs = require('fs');
const url = require('url');

console.log('Start platform-deploy.js script...');

// See https://docs.platform.sh/development/variables.html#platformsh-provided-variables
const PLATFORM_ROUTES = process.env.PLATFORM_ROUTES;
const PLATFORM_BRANCH = process.env.PLATFORM_BRANCH;

if (!PLATFORM_ROUTES) {
  console.log('No Platform.sh environment variables found. Exit.');
  return;
}

// TODO: get rid of CW_REGION variable and region specific components.
// So far just set to IE so frontend can work without CW_REGION variable.
const CW_REGION = process.env.CW_REGION ? process.env.CW_REGION : 'ie';
console.log('Region: ' + CW_REGION);

console.log('Branch: ' + PLATFORM_BRANCH);

// TODO: THIS IS TEMPORARILY DISABLED.
// HTTP AUTH credentials for the frontend.
// IMPORTANT: it should be the same for all frontend environments.
// let PLATFORM_AUTH_USER = 'falcon';
// let PLATFORM_AUTH_PASSWORD = 'FALC0n$!';

// Disable http auth for master branch.
if (PLATFORM_BRANCH === 'master') {
  PLATFORM_AUTH_USER = PLATFORM_AUTH_PASSWORD = '';
}

const routes = JSON.parse(Buffer.from(PLATFORM_ROUTES, 'base64'));

let apiBusUrl = '';
for (let url in routes) {
  let route = routes[url];
  if (route.original_url === 'https://api.{default}/') {
    apiBusUrl = url;
  }
  else if (route.original_url === 'https://donations.api.{default}/') {
    donationsUrl = url;
  }
  else if (route.original_url === 'https://gifts.api.{default}/') {
    giftsUrl = url;
  }
}

if (!apiBusUrl) {
  console.log('Error: API Bus url not found');
  process.exit(1);
}

const mode = (PLATFORM_BRANCH === 'master' ? 'live' : 'test');

let config = "window.cwBackendUrl = '"+ apiBusUrl +"';\r\n";
config += "window.cwDonationsBackendUrl = '"+ donationsUrl +"';\r\n";
config += "window.cwGiftsBackendUrl = '"+ giftsUrl +"';\r\n";
config += "window.cwRegion = '" + CW_REGION + "';\r\n";
config += "window.cwMode = '" + mode + "';\r\n";

// TODO: THIS IS TEMPORARILY DISABLED.
//config += "window.cwBackendHttpUser = '"+ PLATFORM_AUTH_USER +"';\r\n";
//config += "window.cwBackendHttpPassword = '"+ PLATFORM_AUTH_PASSWORD +"';\r\n";



fs.writeFileSync('./build/config/index.js', config);
console.log('Finishing platform-deploy.js script. API Bus URL: ' + apiBusUrl);
