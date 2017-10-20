import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as basketUtils from '../../utils/basket';
import BasketTotal from '../../components/BasketTotal';

const CheckoutBasketSummary = ({ products, currentCurrency }) => (
  <div>
    <h3 className="toolbar-title">Basket total:</h3>
    <h4 className="amount">
      <BasketTotal
        total={basketUtils.getTotal(products, currentCurrency)}
        currentCurrency={currentCurrency}
      />
    </h4>
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
