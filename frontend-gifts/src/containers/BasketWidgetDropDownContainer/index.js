import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _isEmpty from 'lodash/isEmpty';
import * as basketUtils from '../../utils/basket';
import * as basketActions from '../../actions/basket';
import BasketTotal from '../../components/BasketTotal';
import BasketWidgetDropDownItem from '../../components/BasketWidgetDropDownItem';

class BasketWidgetDropDownContainer extends React.Component {

  handleDeleteClick = (productId) => {
    const { dispatch } = this.props;
    dispatch(basketActions.removeProduct(productId));
  }

  render = () => {
    const { currentCurrency, products } = this.props;

    // Don't render anything when there are
    // no products in the basket.
    if (_isEmpty(products)) {
      return <div />;
    }

    // Get an array with the list of renderable products.
    const items = products.map(product => (
      <BasketWidgetDropDownItem
        key={product.id}
        product={product}
        currentCurrency={currentCurrency}
        handleDeleteClick={this.handleDeleteClick.bind(this)}
      />
    ));

    return (
      <div className="cart-dropdown">
        { items }

        <div className="cart-subtotal">
          <div className="column">
            <span>Total:</span>
          </div>
          <div className="column">
            <span className="amount">
              <BasketTotal
                currentCurrency={currentCurrency}
                total={basketUtils.getTotal(products, currentCurrency)}
              />
            </span>
          </div>
        </div>

        <div className="cart-link">
          <Link to="/basket" className="btn btn-primary btn-block">
            Go to basket
          </Link>
        </div>

      </div>
    );
  }
}

BasketWidgetDropDownContainer.propTypes = {
  dispatch: React.PropTypes.func,
  currentCurrency: React.PropTypes.string,
  products: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string,
      quantity: React.PropTypes.number,
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
  products: basketUtils.getProducts(state.basket.products, state.currentCurrency),
});

export default connect(mapStateToProps)(BasketWidgetDropDownContainer);
