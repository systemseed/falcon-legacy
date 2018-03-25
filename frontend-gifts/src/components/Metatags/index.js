import React from 'react';
import { Helmet } from 'react-helmet';
import _isEmpty from 'lodash/isEmpty';

const Metatags = ({ metatags }) => {
  let pageTitle = null;
  if (!_isEmpty(metatags.title) && !_isEmpty(metatags.title.attributes)) {
    pageTitle = React.createElement(
      'title',
      {},
      metatags.title.attributes.content
    );
  }

  const tagsList = Object.keys(metatags).map((tagName) => {
    metatags[tagName].attributes.key = tagName;
    const tag = metatags[tagName].tag || 'meta';
    return React.createElement(
      tag,
      metatags[tagName].attributes
    );
  });

  return (
    <Helmet>
      {pageTitle}
      {tagsList}
    </Helmet>
  );
};

Metatags.propTypes = {
  metatags: React.PropTypes.object.isRequired
};

export default Metatags;
