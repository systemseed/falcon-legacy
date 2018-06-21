import React from 'react';

import BasicPage from '../../components/BasicPage';
import Metatags from '../../components/Metatags';
import FeaturedImage from '../FeaturedImageContainer';
import CorporateGiftsView from '../../views/CorporateGiftsView';
import GiftsCorporateContainer from '../../containers/GiftsCorporateContainer'

class BasicPageContainer extends React.Component {

  constructor(props) {
    super(props);
    console.log("CONSTRUCTOR!!");
    console.log(this.props.location);
    console.log(this.props.page);

  }

  render = () => {
    const page = this.props.page;

    // Hardcoding corporate gifts rendering on `/corporate` path.
    if (this.props.location.pathname = "/corporate") {
      // TODO: Render corporate gifts section
    }

    return (<div className={`basic-page-container path-${page.field_fieldable_path.replace(/\/+/g, '-')}`}>
      <Metatags metatags={page.field_metatags}/>
      {page.field_featured_image &&
      <FeaturedImage uuid={page.field_featured_image}/>}
      <BasicPage page={page}/>

      {/* Hardcoded corporate gifts rendering on `/corporate` path. */}
      {this.props.location.pathname = "/corporate" &&
        <div className="container">
          <GiftsCorporateContainer/>
        </div>
      }

    </div>);
  }
}


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
