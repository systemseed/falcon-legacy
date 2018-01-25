import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Package from '../package';
import inlineCSS from '../styles/theme.scss';
import GTM from '../analytics/GoogleTagManager';
import VWO from '../analytics/VWO';

const HtmlHead = ({ metaData, analytics, favicon }) => {

  const baseUrl = process.env.BASE_URL || window.BASE_URL || '';
  let stylesheets;
  if (process.env.NODE_ENV === 'production') {
    // In production, serve pre-built CSS file from /assets/{version}/main.css
    const pathToCSS = `${baseUrl}/assets/${Package.version}/main.css`;
    stylesheets = <link rel="stylesheet" type="text/css" href={pathToCSS} />;
  }
  else {
    // eslint-disable-next-line react/no-danger
    stylesheets = <style dangerouslySetInnerHTML={{ __html: inlineCSS }} />;
  }

  return (
    <div>
      {/* Analytics scripts */}
      {!!analytics && !!analytics.VWO && <VWO analyticId={analytics.VWO} />}
      {!!analytics && !!analytics.GTM && <GTM analyticId={analytics.GTM} />}

      <Head>
        <title>{metaData.title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {!!favicon && <link rel="shortcut icon" href={baseUrl + favicon} type="image/vnd.microsoft.icon" />}
        {metaData.description && <meta name="description" content={metaData.description} />}
        {metaData.keywords && <meta name="keywords" content={metaData.keywords} />}
        {metaData.title && <meta property="og:title" content={metaData.title} />}
        {metaData.description && <meta property="og:description" content={metaData.keywords} />}
        {metaData.image && <meta property="og:image" content={metaData.image} />}

        {stylesheets}
      </Head>
    </div>
  );
};

HtmlHead.propTypes = {
  favicon: PropTypes.string,
  metaData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  analytics: PropTypes.shape({
    GTM: PropTypes.string,
    VWO: PropTypes.string,
  }),
};

HtmlHead.defaultProps = {
  metaData: {
    title: '',
    description: '',
    keywords: '',
  },
};

export default HtmlHead;
