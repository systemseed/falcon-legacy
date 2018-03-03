import React from 'react';
import Error from 'next/error';
import dynamic from 'next/dynamic';
import App from '../application/App';
import fetch from 'isomorphic-unfetch'
import GTMDataLayer from '../analytics/GoogleTagManagerDataLayer';
import OneColumnLayout from '../components/templates/OneColumnLayout';

// Define dynamic components.
const availableComponents = {
  'SiteHeaderPane': dynamic(import('../components/organisms/SiteHeaderPane')),
  'PageTitleCopyDonatePane': dynamic(import('../components/organisms/PageTitleCopyDonatePane')),
  'TextBlockPane': dynamic(import('../components/organisms/TextBlockPane')),
  'MoneyHandlesWithButtonPane': dynamic(import('../components/organisms/MoneyHandlesWithButtonPane')),
  'DonateButtonPane': dynamic(import('../components/organisms/DonateButtonPane')),
  'ImageWithTextPane': dynamic(import('../components/organisms/ImageWithTextPane')),
  'VideoPlayerPane': dynamic(import('../components/organisms/VideoPlayerPane')),
  'SingUpWithDescriptionPane': dynamic(import('../components/organisms/SingUpWithDescriptionPane')),
  'HeroWithDonationBlockPane': dynamic(import('../components/organisms/HeroWithDonationBlockPane')),
  'FooterDataPane': dynamic(import('../components/organisms/FooterDataPane')),
};

class LandingPage extends React.Component {
  render() {
    const { pageData } = this.props;

    // Redirect to 404 if there is no data for corresponding url in file.
    if (pageData === undefined) {
      return <Error statusCode={404} />;
    }

    // Redirect to 404 if there is no data for corresponding url in file.
    const { components, meta, projectSettings } = pageData;

    // Sort components data, load dynamically and output to the page.
    const pageComponents = components
      .sort((a, b) => a.order > b.order)
      .map((data, i) => {
        const Component = availableComponents[data.type];
        if (Component === undefined) {
          console.error(`"${data.type}" component is missed in availableComponents list.`);
          return <Error statusCode={404} />;
        }

        return (
          <Component key={i} styles={data.styles.join(' ')} {...data.data} />
        )
      });

    // Push variables to GTM DataLayer.
    const GtmDataLayer = {
      "contentTitle": meta.metatags.title,
      "contentType": "cw_donation_landing_page",
      "platformVersion": projectSettings.platformVersion,
      "event": "event.contentView"
    };
    return (
      <App metaData={meta.metatags} projectSettings={projectSettings}>
        <GTMDataLayer dataLayer={GtmDataLayer} />
        <OneColumnLayout>
          {pageComponents}
        </OneColumnLayout>
      </App>
    )
  }

  // Load Page data and project settings from file now, should be given from backend later.
  static getInitialProps = async function({ res, query }) {

    // @todo: validate url
    if (query.file_data_url !== undefined) {
      const result = await fetch(query.file_data_url);

      if (result.status !== 200) {
        res.statusCode = result.status;
        res.end(result.statusText);
        return;
      }

      const pageData = await result.json();
      return { pageData };
    }

    return {};
  }
}

export default LandingPage;