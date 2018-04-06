import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as basketActions from '../../actions/basket';

class BasketItemRemoveBtn extends React.Component {

  handleRemoveClick = () => {
    const { productId, dispatch } = this.props;
    dispatch(basketActions.removeProduct(productId));
  }

  render = () => (
    <Link
      to="#"
      className="item-remove"
      onClick={this.handleRemoveClick}
    >
      Remove
    </Link>
  );
}

BasketItemRemoveBtn.propTypes = {
  dispatch: React.PropTypes.func,
  productId: React.PropTypes.string.isRequired,
};

export default connect()(BasketItemRemoveBtn);
