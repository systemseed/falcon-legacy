import React from 'react';
import { connect } from 'react-redux';
import * as basketUtils from '../../utils/basket';
import BasketWithGifts from '../../components/BasketWithGifts';
import BasketWithCorporateGifts from '../../components/BasketWithCorporateGifts';
import BasketEmpty from '../../components/BasketEmpty';

const BasketContainer = ({ products, basketType, currentCurrency }) => (
  <div>
    { basketType === 'gift' && products.length > 0 &&
    <BasketWithGifts
      products={products}
      currentCurrency={currentCurrency}
    />
    }
    { basketType === 'gift_corporate' && products.length > 0 &&
    <BasketWithCorporateGifts
      products={products}
      currentCurrency={currentCurrency}
    />
    }
    { !products.length &&
    <BasketEmpty
      currentCurrency={currentCurrency}
    />
    }
  </div>
);

BasketContainer.propTypes = {
  currentCurrency: React.PropTypes.string,
  basketType: React.PropTypes.string,
  products: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string,
      quantity: React.PropTypes.number,
      path: React.PropTypes.string,
      data: React.PropTypes.shape({
        id: React.PropTypes.string,
        type: React.PropTypes.string,
        title: React.PropTypes.string,
        annotation: React.PropTypes.string,
        description: React.PropTypes.string,
        categoryId: React.PropTypes.string,
        price: React.PropTypes.object,
      })
    })
  ),
};

const mapStateToProps = state => ({
  currentCurrency: state.currentCurrency,
  basketType: state.basket.type,
  products: basketUtils.getProducts(state.basket.products, state.currentCurrency),
});

export default connect(mapStateToProps)(BasketContainer);
