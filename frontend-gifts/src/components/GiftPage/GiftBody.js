import React from 'react';
import * as productUtils from '../../utils/products';
import AddToBasketButton from '../AddToBasketButton';
import BuyNowButton from '../BuyNowButton';
import ProductPrice from '../ProductPrice';

const GiftBody = ({ gift, currentCurrency }) => (
  <section className="fw-section">
    <div className="gift-content">
      <div className="product-info">
        <h1 className="gift-title">{gift.title}</h1>
        <div className="price-container">
          <ProductPrice
            price={productUtils.getPrice(gift, currentCurrency)}
            currentCurrency={currentCurrency}
          />
        </div>
        <div className="gift-body" dangerouslySetInnerHTML={{ __html: gift.annotation }}/>

        <div className="gift-cta-buttons-container">
          <div className="row">
            <div className="col-md-6 gift-add-to-basket-col">
              <AddToBasketButton product={gift}/>
            </div>
            <div className="col-md-6 gift-buy-now-col">
              <BuyNowButton product={gift}/>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
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
