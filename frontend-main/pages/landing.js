import React from 'react';
import dynamic from 'next/dynamic';
import SiteHeader from '../components/organisms/SiteHeader';

// import HeroBlock from '../components/organisms/HeroBlock';
// import Video from '../components/organisms/Video';
// import TextBlock from '../components/organisms/TextBlock';
// import MoneyHandles from '../components/organisms/MoneyHandles';
// import ListWithImages from '../components/organisms/ListWithImages';
// import ButtonWithHeader from '../components/organisms/ButtonWithHeader';
// import Subscriptions from '../components/tmp/Subscriptions';
import HtmlHead from '../components/organisms/HtmlHead';
import OneColumnLayout from '../components/templates/OneColumnLayout';
import PageTitleWithCopy from '../components/organisms/PageTitleWithCopy';

import pageData from '../data/landing-pages/through-to-2.json';

class LandingPage extends React.Component {
  render() {
    //const PageTitleWithCopy = dynamic(import('../components/organisms/PageTitleWithCopy'));


    const Components = {
      'HtmlHead': HtmlHead,
      'SiteHeader': SiteHeader,
      'PageTitleWithCopy': PageTitleWithCopy,
    };

    // return (
    //   <OneColumnLayout>
    //     {myComponents.map((Component, i) => {
    //       const ComponentName = dynamic(import('../components/organisms/PageTitleWithCopy'));
    //       return (
    //         <div>
    //           <ComponentName key={i} prop="Hello World!" />
    //         </div>
    //       )
    //     })}
    //   </OneColumnLayout>
    // )
    const components = this.props.data.components.map(
      (data, i) => {
        const name = data['type'];
        //var Component = eval(name);  // or eval(name)
        const Component = React.createElement(name, {} );
        // var filename = '../components/organisms/' + data['type'];
        // var filename = '../components/organisms/SiteHeader';
        // const Component = dynamic(import(filename));
        // const Component = dynamic(import('../components/organisms/SiteHeader'));
        console.log(Component);

        return (
          <div key={i}>
            {Component}
            {/*<Component key={i} {...data.data} />*/}
          </div>
        )
      })
    return (
      <OneColumnLayout>
        <HtmlHead/>
        {components}
      </OneColumnLayout>
    )

    // return (
    //   <OneColumnLayout>
    //     <HtmlHead/>
    //     <SiteHeader {...pageData.components[0].data} />
    //     {/*<HeroBlock/>*/}
    //     <PageTitleWithCopy/>
    //     {/*<Video/>*/}
    //     {/*<TextBlock/>*/}
    //     {/*<MoneyHandles/>*/}
    //     {/*<ListWithImages/>*/}
    //     {/*<ButtonWithHeader/>*/}
    //     {/*<Subscriptions/>*/}
    //   </OneColumnLayout>
    // );
  }

  static getInitialProps = async function() {
    const data = await pageData;
    console.log('aaa', data);
    return { data }
  }
}

LandingPage.defaultProps = {

};

LandingPage.propTypes = {

};

export default LandingPage;