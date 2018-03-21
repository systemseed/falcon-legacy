import React from 'react';
import * as productUtils from '../../utils/products';
import AddToBasketButton from '../AddToBasketButton';
import BuyNowButton from '../BuyNowButton';
import ProductPrice from '../ProductPrice';
import AddGiftCorporateDonationContainer from '../../containers/AddGiftCorporateDonationContainer';

const GiftCorporate = ({ gift, currentCurrency }) => (
  <section className="fw-section bg-gray padding-bottom-2x">
    <div className="container">
      <div className="product-info padding-top-1x text-center">
        <h1 className="h2 space-bottom-half">{ gift.title }</h1>
        <h2>
          { !productUtils.isCustomPrice(gift) &&
          <ProductPrice
            price={productUtils.getPrice(gift, currentCurrency)}
            currentCurrency={currentCurrency}
          />
          }
        </h2>
        <div className="text-sm text-gray" dangerouslySetInnerHTML={{ __html: gift.annotation }} />

        <div className="product-tools shop-item">
          { !productUtils.isCustomPrice(gift) &&
          <div>
            <AddToBasketButton product={gift} />
            <BuyNowButton product={gift} />
          </div>
          }
          { productUtils.isCustomPrice(gift) &&
          <AddGiftCorporateDonationContainer />
          }
        </div>

      </div>
    </div>
  </section>
);

GiftCorporate.propTypes = {
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

export default GiftCorporate;
