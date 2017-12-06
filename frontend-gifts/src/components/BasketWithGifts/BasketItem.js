import React from 'react';
import { Link } from 'react-router-dom';
import * as basketUtils from '../../utils/basket';
import * as productUtils from '../../utils/products';
import ProductPrice from '../ProductPrice';
import BasketQuantityWidget from './BasketQuantityWidget';
import BasketItemRemoveBtn from './BasketItemRemoveBtn';
import BundleProductsInBasket from '../BundleProductsInBasket';

const BasketItem = ({ product, currentCurrency }) => (
  <div className="item">
    {/* Show link to all normal gifts */}
    {productUtils.hasFullView(product.data) &&
      <Link to={productUtils.url(product)} className="item-thumb">
        <img src={product.data.imageUrl} alt={product.data.title} />
      </Link>
    }
    {/* No link for custom donation product */}
    {!productUtils.hasFullView(product.data) &&
      <span className="item-thumb">
        <img src={product.data.imageUrl} alt={product.data.title} />
      </span>
    }

    <div className="item-details">

      <h3 className="item-title">
        {/* Show link to all normal gifts */}
        {productUtils.hasFullView(product.data) &&
          <Link to={productUtils.url(product)}>
            {product.data.title}
          </Link>
        }
        {/* No link for custom donation product */}
        {!productUtils.hasFullView(product.data) &&
          product.data.title
        }
      </h3>

      <h4 className="item-price">
        <ProductPrice
          price={basketUtils.getProductPrice(product, currentCurrency)}
          currentCurrency={currentCurrency}
        />
      </h4>
      { basketUtils.hasQuantityWidget(product.data) &&
      <BasketQuantityWidget
        quantity={basketUtils.getProductQuantity(product)}
        productId={product.id}
      />
      }
      {/* Display child products if it's a bundle. */}
      <BundleProductsInBasket bundle={product.data} currency={currentCurrency} />
    </div>
    { basketUtils.hasDeleteButton(product.data) &&
      <BasketItemRemoveBtn productId={product.id} />
    }

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
