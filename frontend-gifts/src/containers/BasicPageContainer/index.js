import React from 'react';

import BasicPage from '../../components/BasicPage';
import Metatags from '../../components/Metatags';
import FeaturedImage from '../FeaturedImageContainer';

const BasicPageContainer = ({ page }) => (
  <div className={`basic-page-container path-${page.field_fieldable_path.replace(/\/+/g, '-')}`}>
    <Metatags metatags={page.field_metatags} />
    {page.field_featured_image &&
      <FeaturedImage uuid={page.field_featured_image} />}
    <BasicPage page={page} />
  </div>
);

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
};

export default BasicPageContainer;
