import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _isEmpty from 'lodash/isEmpty';
import * as basketUtils from '../../utils/basket';
import * as basketActions from '../../actions/basket';
import * as giftsFreeActions from '../../actions/gifts.free';
import BasketTotal from '../../components/BasketTotal';
import BasketWidgetDropDownItem from '../../components/BasketWidgetDropDownItem';
import FreeProductsOfferings from '../FreeProductsOfferings';

class BasketWidgetDropDownContainer extends React.Component {

  handleDeleteClick = (productId) => {
    const { dispatch } = this.props;
    dispatch(basketActions.removeProduct(productId));
  }

  componentWillMount() {
    const { giftsFree, dispatch, done } = this.props;

    // Loads Free products to the store.
    if (!giftsFree.products.length) {
      dispatch(giftsFreeActions.loadAll()).then(done, done);
    }
  }

  render = () => {
    const { currentCurrency, products, basketType } = this.props;

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
        {items}

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
        {basketType === 'gift' &&
          <FreeProductsOfferings className="offering--basket-widget" />
        }
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
  giftsFree: React.PropTypes.shape({
    isPending: React.PropTypes.bool,
    isFulfilled: React.PropTypes.bool,
    isError: React.PropTypes.bool,
    products: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        id: React.PropTypes.string,
        type: React.PropTypes.string,
        title: React.PropTypes.string,
        description: React.PropTypes.string,
        price: React.PropTypes.object,
        imageUrl: React.PropTypes.string,
        imageAlt: React.PropTypes.string,
        amount: React.PropTypes.object,
      })
    ),
  }),
  basketType: React.PropTypes.string,
  done: React.PropTypes.func
};

const mapStateToProps = state => ({
  currentCurrency: state.currentCurrency,
  products: basketUtils.getProducts(state.basket.products, state.currentCurrency),
  giftsFree: state.giftsFree,
  basketType: state.basket.type
});

export default connect(mapStateToProps)(BasketWidgetDropDownContainer);
