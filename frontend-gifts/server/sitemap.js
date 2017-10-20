const request = require('superagent');
const jsonapify = require('superagent-jsonapify');
const config = require('../src/config.js');

jsonapify(request);

module.exports = function sitemap(req, res) {
  const giftProducts = getProductList('gift');
  const giftCorporateProducts = getProductList('gift_corporate');

  Promise.all([giftProducts, giftCorporateProducts]).then((products) => {

    // Outputs sitemap xml document.
    const sitemap = generateXmlSitemap(products[0], products[1]);
    res.header('Content-Type', 'text/xml');
    res.send(sitemap);
  });
};

/**
 * Returns sitemap data in xml format.
 */
const generateXmlSitemap = (gifts, giftsCorporate) => {
  // Gets data for Static pages.
  const staticPagesData = getStaticPagesData();

  // Header of xml document.
  let xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

  // Generates xml for Static pages.
  staticPagesData.forEach((item) => {
    xml += sitemapItem(item.url, item.priority);
  });

  // Generates xml for Gift products.
  const giftsPriority = 0.8;
  gifts
    .filter(item => (item.fieldGiftVariantType === 'normal'))
    .forEach((item) => {
      xml += sitemapItem(item.fieldFieldablePath, giftsPriority);
    });
  // Generates xml for Gift Corporate products.
  giftsCorporate
    .forEach((item) => {
      xml += sitemapItem(item.fieldFieldablePath, giftsPriority);
    });

  // Footer of xml document.
  xml += '</urlset>';
  return xml;
};

/**
 * Returns an array of sitemap data for Statis pages.
 */
const getStaticPagesData = () => {
  return [
    {
      url: '/',
      priority: 1,
    },
    {
      url: '/corporate',
      priority: 0.9,
    },
    {
      url: '/faq',
      priority: 0.6,
    },
    {
      url: '/how-gifts-work',
      priority: 0.6,
    },
    {
      url: '/contact',
      priority: 0.7,
    },
  ]
};

/**
 * Gets Product data by given type.
 */
const getProductList = (type) => {
  return new Promise((resolve, reject) => {
    request
      .get(`${config.default.backend}/v1/donations/jsonapi/commerce_product/${type}`)
      .end((err, res) => {
        if (err) {
          reject(err);
        }
        else if (res.statusCode === 200 && res.body && res.body.data) {
          if (res.body.data.length) {
            resolve(res.body.data);
          }
          else {
            resolve([]);
          }
        }
        else {
          reject('No data set');
        }
      });
  });
};

/**
 * Returns an item for sitemap.
 */
const sitemapItem = (url, priority) => {
  // Removes first "/" char.
  url = url.replace(/^\//, '');
  return `<url>
  <loc>${config.default.frontend}${url}</loc>
  <priority>${priority}</priority>
</url>`;
};
