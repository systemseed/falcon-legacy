import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import BasketWidgetDropDownContainer from '../BasketWidgetDropDownContainer';
import * as basketUtils from '../../utils/basket';

const BasketWidgetContainer = ({ count }) => (
  <div className="cart-btn">
    <Link to="/basket">
      <i>
        <span className="material-icons shopping_basket" />
        <span className="count">{ count }</span>
      </i>
    </Link>
    <BasketWidgetDropDownContainer />
  </div>
);

BasketWidgetContainer.propTypes = {
  count: PropTypes.number,
};

BasketWidgetContainer.defaultProps = {
  count: 0,
};

const mapStateToProps = state => ({
  count: basketUtils.getItemsCount(state.basket.products, state.currentCurrency)
});

export default connect(mapStateToProps)(BasketWidgetContainer);
