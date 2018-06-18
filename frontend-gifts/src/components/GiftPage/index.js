import React from 'react';
import BundleProductsViewContainer from '../../containers/BundleProductsViewContainer';
import GiftBody from './GiftBody';
import GiftInAction from './GiftInAction';
import WhatYouGet from './WhatYouGet';
import BottomCTAs from './BottomCTAs';

const GiftPage = ({ gift, currentCurrency }) => (
  <div className="container tiles-container">
    <div className="bg-white">

      <GiftBody gift={gift} currentCurrency={currentCurrency} />
      <GiftInAction gift={gift} />
      <WhatYouGet gift={gift} />


      {/* In this bundle */}
      {gift.variantType === 'bundle' &&
      <div className="padding-horizontal-10-md padding-horizontal-100-lg">
        <BundleProductsViewContainer bundle={gift} />
      </div>
      }
      {/* end In this bundle */}

      <BottomCTAs gift={gift} currentCurrency={currentCurrency} />
    </div>
  </div>
);

GiftPage.propTypes = {
  currentCurrency: React.PropTypes.string.isRequired,
  gift: React.PropTypes.shape({
    id: React.PropTypes.string,
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    categoryId: React.PropTypes.string,
    variantType: React.PropTypes.string,
    annotation: React.PropTypes.string,
    description: React.PropTypes.string,
    price: React.PropTypes.object,
    imageUrl: React.PropTypes.string,
    imageAlt: React.PropTypes.string,
    actionImageUrl: React.PropTypes.string,
    actionImageAlt: React.PropTypes.string,
    actionDescription: React.PropTypes.string,
  }).isRequired,
};

export default GiftPage;
