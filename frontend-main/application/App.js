import React from 'react';
import HtmlHead from './HtmlHead';

const App = ({ metaData, children }) => (
  <div>
    <HtmlHead metaData={metaData} />
    { children }
  </div>
);

export default App;