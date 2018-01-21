import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

class GoogleTagManagerDataLayer extends React.Component {

  render() {
    const { dataLayer } = this.props;

    return (
      <Head>
        <script dangerouslySetInnerHTML={{ __html: `var dataLayer = dataLayer || []; dataLayer.push(${JSON.stringify(dataLayer)});` }} />
      </Head>
    )
  }
}

GoogleTagManagerDataLayer.propTypes = {
  dataLayer: PropTypes.object.isRequired
};

export default GoogleTagManagerDataLayer;