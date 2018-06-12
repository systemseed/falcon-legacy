import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import NotFoundView from '../NotFoundView';
import GiftsCorporateContainer from '../../containers/GiftsCorporateContainer';
import GiftsCorporateInfoGrid from '../../components/GiftsCorporateInfoGrid';
import FeaturedImage from '../../containers/FeaturedImageContainer';
import CustomPageMetatags from '../../components/CustomPageMetatags';

const CorporateGiftsView = ({ siteContentSettings }) => {
  if (!siteContentSettings.fieldConfigCorporateEnabled) {
    return <NotFoundView />;
  }

  return (
    <div className="corporate-gifts">
      <CustomPageMetatags id="corporate" />
      <FeaturedImage uuid="dc6cde6a-7b9c-4292-aa36-d1091b078154" />
      <div className="container">
        <GiftsCorporateInfoGrid />
        <GiftsCorporateContainer />
      </div>
    </div>
  );
};

CorporateGiftsView.propTypes = {
  siteContentSettings: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  siteContentSettings: state.siteContentSettings.data,
});

export default connect(mapStateToProps)(CorporateGiftsView);
