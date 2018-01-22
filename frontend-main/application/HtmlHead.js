import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Package from '../package';
import inlineCSS from '../styles/theme.scss';
import GTM from '../analytics/GoogleTagManager';

const HtmlHead = ({ metaData, analytics, favicon }) => {

  let stylesheets;
  if (process.env.NODE_ENV === 'production') {
    // In production, serve pre-built CSS file from /assets/{version}/main.css
    const pathToCSS = `${process.env.BASE_URL}/assets/${Package.version}/main.css`;
    stylesheets = <link rel="stylesheet" type="text/css" href={pathToCSS} />;
  }
  else {
    // eslint-disable-next-line react/no-danger
    stylesheets = <style dangerouslySetInnerHTML={{ __html: inlineCSS }} />;
  }

  return (
    <div>
      {/* Analytics scripts */}
      {!!analytics && !!analytics.GTM && <GTM analyticId={analytics.GTM} />}

      <Head>
        <title>{metaData.title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {!!favicon && <link rel="shortcut icon" href={process.env.BASE_URL + favicon} type="image/vnd.microsoft.icon" />}
        {metaData.description && <meta name="description" content={metaData.description} />}
        {metaData.keywords && <meta name="keywords" content={metaData.keywords} />}
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
  }).isRequired,
  analytics: PropTypes.shape({
    GTM: PropTypes.string,
    GA: PropTypes.string,
    YM: PropTypes.string,
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
