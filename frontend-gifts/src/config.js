let config = {}; // eslint-disable-line import/no-mutable-exports

if (typeof window !== 'undefined') {
  config = {
    // Backend url is global variable that can be set by Platform.sh after
    // project is built.
    'region': window.cwRegion, // eslint-disable-line no-undef
    'mode': window.cwMode, // eslint-disable-line no-undef
    'isServer': false,
    'frontend': window.cwFrontendUrl, // eslint-disable-line no-undef
    'backend': window.cwBackendUrl, // eslint-disable-line no-undef
    'donations': window.cwDonationsBackendUrl, // eslint-disable-line no-undef
    'gifts': window.cwGiftsBackendUrl // eslint-disable-line no-undef,
  };
}
else {
  // TODO: this code shouldn't be bundled into frontend package because it exposes names
  // of internal environment variables.
  config = {
    'region': process.env.CW_REGION ? process.env.CW_REGION : 'ie',
    'mode': process.env.PLATFORM_BRANCH === 'master' ? 'live' : 'test',
    'isServer': true,
    'frontend': 'http://gifts.flc.local/',
    'backend': 'http://api_bus/',
    'donations': 'http://donations.api.flc.local/',
    'gifts': 'http://gifts.api.flc.local/'
  };

  if (process.env.PLATFORM_ROUTES) {
    const routes = JSON.parse(Buffer.from(process.env.PLATFORM_ROUTES, 'base64'));
    for (const url in routes) { // eslint-disable-line
      const route = routes[url];
      if (route.original_url === 'https://{default}/') {
        config.frontend = url;
      }
      else if (route.original_url === 'https://api.{default}/') {
        config.backend = url;
      }
      else if (route.original_url === 'https://donations.api.{default}/') {
        config.donations = url;
      }
      else if (route.original_url === 'https://gifts.api.{default}/') {
        config.gifts = url;
      }
    }
  }
}

export default config;
