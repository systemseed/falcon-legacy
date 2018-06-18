import React from 'react';
import * as productUtils from '../../utils/products';
import AddToBasketButton from '../AddToBasketButton';
import BuyNowButton from '../BuyNowButton';
import ProductPrice from '../ProductPrice';

const GiftBody = ({ gift, currentCurrency }) => (
  <div className="row row-eq-height">
    <div className="col-md-6 tile-image-col-left no-gutter-sm">
      <div className="tile tile--image-section">
        <section className="fw-section tile--image-section tile--image-section--primary object-fit-wrapper">
          <img className="object-fit-cover" src={gift.imageUrl} alt={gift.imageAlt} title={gift.imageAlt} />
        </section>
      </div>
    </div>
    <div className="col-md-6">
      <div className="tile tile--text-section tile--text-section--primary">
        <section className="fw-section">
          <div className="gift-content">
            <div className="product-info">
              <h1 className="tile-gift-title">{gift.title}</h1>
              <div className="tile-gift-price">
                <ProductPrice
                  price={productUtils.getPrice(gift, currentCurrency)}
                  currentCurrency={currentCurrency}
                />
              </div>
              <div className="tile-gift-body" dangerouslySetInnerHTML={{ __html: gift.annotation }} />

              <div className="tile-gift-cta-buttons">
                <div className="row">
                  <div className="col-sm-6 tile-add-to-basket-button-col">
                    <AddToBasketButton prodct={gift} />
                  </div>
                  <div className="col-sm-6 gift-buy-now-col">
                    <BuyNowButton product={gift} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
);

GiftBody.propTypes = {
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
    actionImageUrl: React.PropTypes.string,
    actionDescription: React.PropTypes.string,
  }).isRequired,
};

export default GiftBody;
