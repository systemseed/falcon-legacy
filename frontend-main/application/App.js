import React from 'react';
import HtmlHead from './HtmlHead';
import CookiesPopup from '../components/molecules/CookiesPopup';

class App extends React.Component {
  render() {
    const { metaData, projectSettings, children } = this.props;

    return (
      <div>
        <HtmlHead metaData={metaData} analytics={projectSettings.analytics} />
        { children }
        <CookiesPopup />
      </div>
    )
  }
}

export default App;