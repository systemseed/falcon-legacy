import React from 'react';
import GiftsCorporateContainer from '../../containers/GiftsCorporateContainer';
import GiftsCorporateInfoGrid from '../../components/GiftsCorporateInfoGrid';
import FeaturedImage from '../../containers/FeaturedImageContainer';
import CustomPageMetatags from '../../components/CustomPageMetatags';

const CorporateGiftsView = () => (
  <div>
    <CustomPageMetatags id='corporate' />
    <FeaturedImage uuid="dc6cde6a-7b9c-4292-aa36-d1091b078154" />
    <GiftsCorporateInfoGrid />
    <GiftsCorporateContainer />
  </div>
);

export default CorporateGiftsView;
