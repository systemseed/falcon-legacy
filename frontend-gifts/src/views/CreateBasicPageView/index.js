import React from 'react';
import Metatags from '../../components/Metatags';
import CreateBasicPageContainer from '../../containers/CreateBasicPageContainer';
import LatestPageContainer from '../../containers/LatestPageContainer';

// TODO: component name should be the same as component folder.
const Contact = () => (
  <div>
    <Metatags metatags={{"title": {"attributes": {"content": "Create basic page | Gifts"}}}} />
    <h2>Create Page</h2>
    <CreateBasicPageContainer />
    <LatestPageContainer />
  </div>
);

export default Contact;
