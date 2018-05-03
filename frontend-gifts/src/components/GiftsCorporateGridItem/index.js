import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import * as productUtils from '../../utils/products';
import ProductPrice from '../ProductPrice';
import AddToBasketButton from '../AddToBasketButton';
import BuyNowButton from '../BuyNowButton';

const GiftsGridCorporateItem = ({ productData, currentCurrency }) => (
  <div className="shop-item">
    <h3 className="shop-item-title">
      <Link to={productUtils.url(productData)}>
        {productData.title}
      </Link>
    </h3>
    <div className="shop-thumbnail">
      <Link to={productUtils.url(productData)} className="item-link" />
      <img src={productData.imageUrl} alt={productData.imageAlt} title={productData.imageAlt} />

      {!productUtils.isCustomPrice(productData) &&
        <div className="shop-item-tools">
          <AddToBasketButton
            product={productData}
          />
          <BuyNowButton product={productData} />
        </div>
      }

    </div>

    <div className="shop-item-details">

      {!productUtils.isCustomPrice(productData) &&
        <span className="shop-item-price">
          <ProductPrice
            price={productUtils.getPrice(productData, currentCurrency)}
            currentCurrency={currentCurrency}
          />
        </span>
      }

    </div>

  </div>
);

// Declare required props.
GiftsGridCorporateItem.propTypes = {
  productData: PropTypes.shape({
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
  }).isRequired,
  currentCurrency: PropTypes.string.isRequired,
};

export default GiftsGridCorporateItem;
