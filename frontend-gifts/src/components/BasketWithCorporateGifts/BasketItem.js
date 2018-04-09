import React from 'react';
import { Link } from 'react-router-dom';
import * as basketUtils from '../../utils/basket';
import * as productUtils from '../../utils/products';
import ProductPrice from '../ProductPrice';
import BasketItemControls from '../BasketItemControls';

const BasketItem = ({ product, currentCurrency }) => (
  <div className="item">
    <div className="item-row">
      <Link to={productUtils.url(product.data)} className="item-thumb">
        <img src={product.data.imageUrl} alt={product.data.title} />
      </Link>

      <div className="item-details">

        <h3 className="item-title">
          <Link to={productUtils.url(product.data)}>
            {product.data.title}
          </Link>
        </h3>

        <h4 className="item-price">
          <ProductPrice
            price={basketUtils.getProductPrice(product, currentCurrency)}
            currentCurrency={currentCurrency}
          />
        </h4>
        <BasketItemControls product={product} />
      </div>
    </div>
  </div>
);

BasketItem.propTypes = {
  currentCurrency: React.PropTypes.string,
  product: React.PropTypes.shape({
    id: React.PropTypes.string,
    quantity: React.PropTypes.number,
    data: React.PropTypes.shape({
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
    })
  }),
};

export default BasketItem;
