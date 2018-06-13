import React from 'react';
import GiftHeroImage from './GiftHeroImage';
import GiftBody from './GiftBody';
import GiftTabs from './GiftTabs';
import * as productUtils from '../../utils/products';

const GiftPage = ({ gift, currentCurrency }) => (
  <div className="container gift-container gutters-md no-gutters">
    <div className="bg-white">

      {/* primary content */}
      <div className="row row-eq-height">
        <div className="col-sm-6 gutters-md no-right-gutter-md no-gutters">
          <GiftHeroImage gift={gift}/>
        </div>
        <div className="col-sm-6 gutters-md no-gutters">
          <GiftBody gift={gift} currentCurrency={currentCurrency}/>
        </div>
      </div>
      {/* end primary content */}

      {/* gift in action */}
      <div className="row row-eq-height">
        <div className="col-sm-6 col-sm-push-6 gutters-md no-left-gutter-md no-gutters">
          <section className="fw-section gift-primary-image-container object-fit-wrapper">
            <img className="object-fit-cover" src={gift.actionImageUrl} alt={gift.actionImageAlt}
                 title={gift.actionImageAlt}/>
          </section>
          {/*<GiftHeroImage gift={gift} />*/}
        </div>
        <div className="col-sm-6 col-sm-pull-6 gutters-md no-gutters">
          <section className="fw-section">
            <div className="gift-content secondary-section-container">
              <h1 className="gift-title secondary-section-title">Gift in action</h1>
              {gift.actionDescription &&
              <div className="padding-right" dangerouslySetInnerHTML={{ __html: gift.actionDescription }}/>
              }
            </div>
          </section>
        </div>
      </div>
      {/* end gift in action */}

      {/*<GiftTabs gift={gift}/> */}
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
