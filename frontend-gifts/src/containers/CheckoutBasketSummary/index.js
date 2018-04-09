import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as basketUtils from '../../utils/basket';
import BasketSummary from '../../components/BasketWithGifts/BasketSummary';


const CheckoutBasketSummary = ({ products, currentCurrency }) => (
  <div>
    <BasketSummary
      className="text-sm lead-md"
      total={basketUtils.getTotal(products, currentCurrency)}
      currency={currentCurrency}
    />
  </div>
);

CheckoutBasketSummary.propTypes = {
  currentCurrency: PropTypes.string,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      quantity: PropTypes.number,
      data: PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
        title: PropTypes.string,
        annotation: PropTypes.string,
        description: PropTypes.string,
        categoryId: PropTypes.string,
        price: PropTypes.object,
      })
    })
  ),
};

const mapStateToProps = state => ({
  currentCurrency: state.currentCurrency,
  products: basketUtils.getProducts(state.basket.products, state.currentCurrency),
});

export default connect(mapStateToProps)(CheckoutBasketSummary);
