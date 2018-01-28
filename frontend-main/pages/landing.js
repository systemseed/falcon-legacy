import React from 'react';
import Error from 'next/error';
import dynamic from 'next/dynamic';
import App from '../application/App';
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
};

class LandingPage extends React.Component {
  render() {
    const { projectSettings, pageData, url } = this.props;

    // Remove first "/" and _GET params to get page ID.
    const pageId = url.asPath.substr(1).split("?")[0];

    // Redirect to 404 if there is no data for corresponding url in file.
    if (pageData[pageId] === undefined) {
      return <Error statusCode={404} />;
    }
    const { components, meta } = pageData[pageId];

    // Sort components data, load dynamically and output to the page.
    const pageComponents = components
      .sort((a, b) => a.order > b.order)
      .map((data, i) => {
        const Component = availableComponents[data.type];
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
  static getInitialProps = async function() {
    // @todo: Load pages data from backend by given params in url.
    // "key" - url of the page defined in ./routes.js, "value" - path to the file with data.
    const pageData = {
      'donation-landing-page': await import('../data/landing-pages/donation-landing-page.json')
    };
    const projectSettings = await import('../data/project-settings.json');
    return { pageData, projectSettings }
  }
}

export default LandingPage;