import React from 'react';

const GiftInAction = ({ gift }) => (
  <div className="row row-eq-height">
    <div className="col-md-push-6 col-md-6 tile-image-col-right no-gutter-sm">
      <div className="tile tile--image-section">
        <section className="fw-section tile--image-section object-fit-wrapper">
          <img
            className="object-fit-cover" src={gift.actionImageUrl} alt={gift.actionImageAlt}
            title={gift.actionImageAlt}
          />
        </section>
      </div>
    </div>
    <div className="col-md-pull-6 col-md-6">
      <div className="tile tile--text-section">
        <section className="fw-section">
          <div className="gift-content">
            <div className="product-info">
              <h1 className="tile-gift-title tile-gift-title--in-action">Gift in action</h1>
              <div className="tile-gift-body" dangerouslySetInnerHTML={{ __html: gift.actionDescription }} />
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
);

GiftInAction.propTypes = {
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
    actionImageUrl: React.PropTypes.string,
    actionDescription: React.PropTypes.string,
  }).isRequired,
};

export default GiftInAction;
