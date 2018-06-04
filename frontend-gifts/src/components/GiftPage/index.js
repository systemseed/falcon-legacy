import React from 'react';
import GiftHeroImage from './GiftHeroImage';
import GiftBody from './GiftBody';
import GiftTabs from './GiftTabs';

const GiftPage = ({ gift, currentCurrency }) => (
  <div className="container">
    <div className="bg-white">
      <GiftHeroImage gift={gift}/>
      <GiftBody gift={gift} currentCurrency={currentCurrency}/>
      <GiftTabs gift={gift}/>
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
