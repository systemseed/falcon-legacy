import React from 'react';
import BasicPage from '../../components/BasicPage';
import Metatags from '../../components/Metatags';
import FeaturedImage from '../FeaturedImageContainer';

const BasicPageContainer = ({ page, location }) => {
  // Quick workaround for Coprorate page which now uses basic page tempate.
  // TODO: get rid of it in the future.
  const corporate = (location.pathname === '/corporate');

  return (<div className={`basic-page-container path-${page.field_fieldable_path.replace(/\/+/g, '-')}`}>
    <Metatags metatags={page.field_metatags} />
    {page.featuredImageId &&
      <FeaturedImage uuid={page.featuredImageId} />}
    <BasicPage page={page} corporate={corporate} />
  </div>);
};


BasicPageContainer.propTypes = {
  page: React.PropTypes.shape({
    uuid: React.PropTypes.string,
    title: React.PropTypes.string,
    body: React.PropTypes.shape({
      value: React.PropTypes.string,
      summary: React.PropTypes.string,
      format: React.PropTypes.string,
    }),
    field_fieldable_path: React.PropTypes.string,
    field_metatags: React.PropTypes.object
  }).isRequired,
  location: React.PropTypes.object,
};

export default BasicPageContainer;
