import React from 'react';
import * as productUtils from '../../utils/products';
import AddToBasketButton from '../AddToBasketButton';
import BuyNowButton from '../BuyNowButton';
import ProductPrice from '../ProductPrice';

const BottomCTAs = ({ gift, currentCurrency }) => (
  <div className="padding-horizontal-10-md padding-horizontal-100-lg">
    <div className="tile tile--text-section--bottom-ctas row">
      <div className="col-md-5">
        <section className="fw-section">
          <div className="gift-content">
            <div className="product-info product-info--bottom">
              <div className="row">
                <div className="col-md-9">
                  <h1 className="tile-gift-title">{gift.title}</h1>
                </div>
                <div className="col-md-3">
                  <div className="tile-gift-price tile-gift-price--bottom">
                    <ProductPrice
                      price={productUtils.getPrice(gift, currentCurrency)}
                      currentCurrency={currentCurrency}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="col-md-7">
        <div className="tile-gift-cta-buttons tile-gift-cta-buttons--bottom">
          <div className="row">
            <div className="col-sm-6 tile-add-to-basket-button-col">
              <AddToBasketButton product={gift} />
            </div>
            <div className="col-sm-6 gift-buy-now-col">
              <BuyNowButton product={gift} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

BottomCTAs.propTypes = {
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

export default BottomCTAs;
