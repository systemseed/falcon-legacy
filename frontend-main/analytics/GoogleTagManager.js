import React from 'react';
import Head from 'next/head';

class GoogleTagManager extends React.Component {
  componentDidMount() {
    eval(document.getElementById('GTM1'));
  }
  render() {
    return (
      <div>
        <Head>
          <script
            dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl+'${this.props.analyticQuery}';f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${this.props.analyticId}');` }}
            id="GTM1"
          />
        </Head>
        <noscript
          dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${this.props.analyticId}${this.props.analyticQuery}"
            height="0" width="0" style="display:none;visibility:hidden;" />`}}
          id="GTM2"
        />
      </div>
    )
  }
}
export default GoogleTagManager;