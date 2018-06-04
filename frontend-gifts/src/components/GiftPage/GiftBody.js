import React from 'react';
import * as productUtils from '../../utils/products';
import AddToBasketButton from '../AddToBasketButton';
import BuyNowButton from '../BuyNowButton';
import ProductPrice from '../ProductPrice';

const GiftBody = ({ gift, currentCurrency }) => (
  <section className="fw-section padding-bottom-2x">
    <div>
      <div className="product-info padding-top-1x text-center">
        <h1 className="h2 space-bottom-half">{ gift.title }</h1>
        <h2>
          <ProductPrice
            price={productUtils.getPrice(gift, currentCurrency)}
            currentCurrency={currentCurrency}
          />
        </h2>
        <div className="text-sm text-gray" dangerouslySetInnerHTML={{ __html: gift.annotation }} />

        <div className="product-tools shop-item">
          <AddToBasketButton product={gift} />
          <BuyNowButton product={gift} />
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
