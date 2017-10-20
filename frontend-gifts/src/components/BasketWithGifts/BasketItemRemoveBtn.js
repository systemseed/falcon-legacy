import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as basketActions from '../../actions/basket';

class BasketItemRemoveBtn extends React.Component {

  handleRemoveClick = () => {
    const { productId, dispatch } = this.props;
    dispatch(basketActions.removeProduct(productId));
  }

  render = () => (
    <Button
      className="item-remove"
      onClick={this.handleRemoveClick}
    >
      <i className="material-icons remove_shopping_cart" />
    </Button>
  );
}

BasketItemRemoveBtn.propTypes = {
  dispatch: React.PropTypes.func,
  productId: React.PropTypes.string.isRequired,
};

export default connect()(BasketItemRemoveBtn);
