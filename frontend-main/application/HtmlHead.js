import React from 'react';
import Head from 'next/head';
import Package from '../package';
import VWO from '../analytics/VWO';
import PropTypes from 'prop-types';
import inlineCSS from '../styles/theme.scss';
import GTM from '../analytics/GoogleTagManager';

// Adds IE11 support for react-player.
import "core-js/fn/symbol/iterator"
import "core-js/fn/symbol"

const HtmlHead = ({ metaData, analytics }) => {
  // Use Base url defined in server rendering, or variable added by backend SSI.
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
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        <link rel="shortcut icon" href={baseUrl + "/static/favicon.ico"} type="image/vnd.microsoft.icon" />

        {metaData.description && <meta name="description" content={metaData.description} />}
        {metaData.keywords && <meta name="keywords" content={metaData.keywords} />}

        {metaData.title && <meta property="og:title" content={metaData.title} />}
        {metaData.description && <meta property="og:description" content={metaData.description} />}
        {metaData.image && <meta property="og:image" content={metaData.image} />}
        {!!analytics && !!analytics.GTM && <meta property="fb:app_id" content={analytics.FacebookAppId} />}
        <meta property="og:type" content="website" />

        <link rel="apple-touch-icon-precomposed" href={baseUrl + "/static/apple-touch-icon-precomposed.png"} />
        <link rel="apple-touch-icon-precomposed" href={baseUrl + "/static/apple-touch-icon-72x72-precomposed.png"} sizes="72x72" />
        <link rel="apple-touch-icon-precomposed" href={baseUrl + "/static/apple-touch-icon-144x144-precomposed.png"} sizes="144x144" />
        <link rel="apple-touch-icon-precomposed" href={baseUrl + "/static/apple-touch-icon-114x114-precomposed.png"} sizes="114x114" />

        {stylesheets}
      </Head>
    </div>
  );
};

HtmlHead.propTypes = {
  metaData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  analytics: PropTypes.shape({
    GTM: PropTypes.string,
    VWO: PropTypes.string,
    FacebookAppId: PropTypes.string,
  }),
};

export default HtmlHead;
