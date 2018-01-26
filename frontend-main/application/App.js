import React from 'react';
import HtmlHead from './HtmlHead';

class App extends React.Component {
  render() {
    const { metaData, projectSettings, pagePath, children } = this.props;

    return (
      <div>
        <HtmlHead metaData={metaData} analytics={projectSettings.analytics} pagePath={pagePath} favicon="/static/favicon.ico"/>
        { children }
      </div>
    )
  }
}

export default App;