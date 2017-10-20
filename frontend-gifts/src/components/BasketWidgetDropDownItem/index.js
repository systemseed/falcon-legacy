import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import * as basketUtils from '../../utils/basket';
import * as productUtils from '../../utils/products';
import ProductPrice from '../ProductPrice';

const BasketWidgetDropDownItem = ({ product, currentCurrency, handleDeleteClick }) => (
  <div className="cart-item">

    { /* Link title to the usual products */ }
    { productUtils.hasFullView(product.data) &&
    <Link to={productUtils.url(product.data)} className="item-thumb">
      <img src={product.data.imageUrl} alt={product.data.title} />
    </Link>
    }
    { /* Don't show linked title to custom price product */ }
    { !productUtils.hasFullView(product.data) &&
    <span className="item-thumb">
      <img src={product.data.imageUrl} alt={product.data.title} />
    </span>
    }

    <div className="item-details">
      <h3 className="item-title">

        { /* Link title to the usual products */ }
        { productUtils.hasFullView(product.data) &&
        <Link to={productUtils.url(product.data)}>
          { product.data.title }
        </Link>
        }
        { /* Don't show linked title to custom price product */ }
        { !productUtils.hasFullView(product.data) &&
        product.data.title
        }

      </h3>
      <h4 className="item-price">
        { basketUtils.getProductQuantity(product) }
        &nbsp;x&nbsp;
        <ProductPrice
          currentCurrency={currentCurrency}
          price={basketUtils.getProductPrice(product, currentCurrency)}
        />
      </h4>
    </div>
    <Button
      bsStyle="link"
      className="close-btn"
      onClick={(e) => {
        e.preventDefault();
        handleDeleteClick(product.id);
      }}
    >
      <i className="material-icons close" />
    </Button>
  </div>
);

BasketWidgetDropDownItem.propTypes = {
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
    }),
  }).isRequired,
  currentCurrency: React.PropTypes.string.isRequired,
  handleDeleteClick: React.PropTypes.func.isRequired,
};

export default BasketWidgetDropDownItem;
