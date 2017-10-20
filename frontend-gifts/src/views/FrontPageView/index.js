import React from 'react';
import GiftsContainer from '../../containers/GiftsContainer';
import ModalGiftCard from '../../components/ModalGiftCard';
import FrontPageCopy from '../../components/FrontPageCopy';
import FeaturedImage from '../../containers/FeaturedImageContainer';
import CustomPageMetatags from '../../components/CustomPageMetatags';

const FrontPageView = ({ match }) => (
  <div>
    <CustomPageMetatags id="front" />
    <FeaturedImage uuid="722f5be9-151e-405f-9890-df742dd3376b" />

    <FrontPageCopy />

    <GiftsContainer />

    {/* Render Gift Card with front page on background. */}
    {match.params.giftCard !== undefined &&
      <ModalGiftCard cardId={match.params.giftCard} />
    }
  </div>
);

export default FrontPageView;
