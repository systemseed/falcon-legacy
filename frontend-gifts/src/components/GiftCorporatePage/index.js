import React from 'react';
import GiftCorporateHeroImage from './GiftCorporateHeroImage';
import GiftCorporateBody from './GiftCorporateBody';
import GiftCorporateTabs from './GiftCorporateTabs';

const GiftCorporatePage = ({ giftCorporate, currentCurrency }) => (
  <div>
    <GiftCorporateHeroImage gift={giftCorporate} />
    <GiftCorporateBody gift={giftCorporate} currentCurrency={currentCurrency} />
    <GiftCorporateTabs gift={giftCorporate} />
  </div>
);

GiftCorporatePage.propTypes = {
  currentCurrency: React.PropTypes.string.isRequired,
  giftCorporate: React.PropTypes.shape({
    id: React.PropTypes.string,
    title: React.PropTypes.string,
    variantType: React.PropTypes.string,
    annotation: React.PropTypes.string,
    description: React.PropTypes.string,
    price: React.PropTypes.object,
  }).isRequired,
};

export default GiftCorporatePage;
