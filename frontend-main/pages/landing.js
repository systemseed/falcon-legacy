import React from 'react';
import dynamic from 'next/dynamic';
import HtmlHead from '../components/organisms/HtmlHead';
import OneColumnLayout from '../components/templates/OneColumnLayout';

const availableComponents = {
  'SiteHeader': dynamic(import('../components/organisms/SiteHeader')),
  'PageTitleWithCopy': dynamic(import('../components/organisms/PageTitleWithCopy')),
};

class LandingPage extends React.Component {
  render() {
    const {components} = this.props.data;

    const pageComponents = components.map((data, i) => {
        const Component = availableComponents[data.type];
        return (
          <Component key={i} styles={data.styles.join(' ')} {...data.data} />
        )
      })

    return (
      <OneColumnLayout>
        <HtmlHead/>
        {pageComponents}
      </OneColumnLayout>
    )
  }

  static getInitialProps = async function() {
    const data = await import('../data/landing-pages/through-to-2.json');
    return { data }
  }
}

LandingPage.defaultProps = {

};

LandingPage.propTypes = {

};

export default LandingPage;