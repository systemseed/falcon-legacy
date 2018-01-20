import React from 'react';
import dynamic from 'next/dynamic';
import App from '../application/App';
import OneColumnLayout from '../components/templates/OneColumnLayout';

const availableComponents = {
  'SiteHeader': dynamic(import('../components/organisms/SiteHeader')),
  'PageTitleWithCopy': dynamic(import('../components/organisms/PageTitleWithCopy')),
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
    const { projectSettings, pageData } = this.props;
    const {components, meta } = pageData;

    const pageComponents = components
      .sort((a, b) => a.order > b.order)
      .map((data, i) => {
        const Component = availableComponents[data.type];
        return (
          <Component key={i} styles={data.styles.join(' ')} {...data.data} />
        )
      })

    return (
      <App metaData={meta.metatags} projectSettings={projectSettings} >
        <OneColumnLayout>
          {pageComponents}
        </OneColumnLayout>
      </App>
    )
  }

  static getInitialProps = async function() {
    const pageData = await import('../data/landing-pages/donation-landing-page.json');
    const projectSettings = await import('../data/project-settings.json');
    return { pageData, projectSettings }
  }
}

LandingPage.defaultProps = {

};

LandingPage.propTypes = {

};

export default LandingPage;