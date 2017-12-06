const config = require('../src/config.js');

module.exports = function robotstxt(req, res) {
  let robots = `# Concern Gifts
User-agent: *
Sitemap: ${config.default.frontend}sitemap.xml`;

  // Disallow indexing before 2018: https://www.pivotaltracker.com/story/show/153289794
  if (Date.now() < new Date('2018-01-01').getTime()) {
    robots = `# Concern Gifts
User-agent: *
Disallow: /`;
  }

  res.header('Content-Type', 'text/plain');
  res.send(robots);
};
