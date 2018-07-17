import React from 'react';
import Metatags from '../../components/Metatags';
import FeaturedImage from '../FeaturedImageContainer';

const BasicPageContainer = ({ page, children }) => (
  <div className={`basic-page-container path-${page.field_fieldable_path.replace(/\/+/g, '-')}`}>
    <Metatags metatags={page.field_metatags} />
    {page.featuredImageId &&
      <FeaturedImage uuid={page.featuredImageId} />}
    {/* Render all contents of the page. */}
    {children}
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
  children: React.PropTypes.node
};

export default BasicPageContainer;
