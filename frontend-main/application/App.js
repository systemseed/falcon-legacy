import React from 'react';
import HtmlHead from './HtmlHead';

class App extends React.Component {
  render() {
    const { metaData, projectSettings, children } = this.props;

    return (
      <div>
        <HtmlHead metaData={metaData} analytics={projectSettings.analytics} />
        { children }
      </div>
    )
  }
}

export default App;