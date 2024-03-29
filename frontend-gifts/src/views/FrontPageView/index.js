import React, { PropTypes } from 'react';
import GiftsContainer from '../../containers/GiftsContainer';
import ModalGiftCard from '../../components/ModalGiftCard';
import FrontPageCopy from '../../components/FrontPageCopy';
import CustomPageMetatags from '../../components/CustomPageMetatags';

const FrontPageView = ({ match }) => (
  <div className="frontpage">
    {match.params.categoryName === undefined &&
    <CustomPageMetatags id="front" />}

    <FrontPageCopy />

    <div className="container">
      <div className="bg-white padding-bottom-2x">
        <GiftsContainer categoryName={match.params.categoryName} />

        {/* Render Gift Card with front page on background. */}
        {match.params.giftCard !== undefined &&
        <ModalGiftCard cardId={match.params.giftCard} />
        }
      </div>
    </div>
  </div>
);

FrontPageView.propTypes = {
  match: PropTypes.object
};

export default FrontPageView;
