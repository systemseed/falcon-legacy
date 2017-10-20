import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import * as productUtils from '../../utils/products';
import ProductPrice from '../ProductPrice';
import AddToBasketButton from '../AddToBasketButton';

const GiftsGridItem = ({ productData, currentCurrency }) => (
  <div className="shop-item">

    <div className="shop-thumbnail">

      <Link to={productUtils.url(productData)} className="item-link" />
      <img src={productData.imageUrl} alt={productData.title} />

      <div className="shop-item-tools">
        <AddToBasketButton
          product={productData}
        />
      </div>

    </div>

    <div className="shop-item-details">
      <h3 className="shop-item-title">
        <Link to={productUtils.url(productData)}>
          {productData.title}
        </Link>
      </h3>
      <span className="shop-item-price">
        <ProductPrice
          price={productUtils.getPrice(productData, currentCurrency)}
          currentCurrency={currentCurrency}
        />
      </span>
    </div>

  </div>
);

// Declare required props.
GiftsGridItem.propTypes = {
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
    actionImageUrl: React.PropTypes.string,
    actionDescription: React.PropTypes.string,
  }).isRequired,
  currentCurrency: PropTypes.string.isRequired,
};

export default GiftsGridItem;
