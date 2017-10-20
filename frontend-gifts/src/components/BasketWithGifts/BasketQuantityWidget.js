import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import * as basketActions from '../../actions/basket';

class BasketQuantityWidget extends React.Component {

  handleQuantityDecrease = () => {
    const { productId, dispatch } = this.props;
    dispatch(
      basketActions.decreaseProductQuantity(productId)
    );
  };

  handleQuantityIncrease = () => {
    const { productId, dispatch } = this.props;
    dispatch(
      basketActions.increaseProductQuantity(productId)
    );
  };

  render = () => {
    const { quantity } = this.props;

    const decreaseBtnProps = {
      className: 'incr-btn',
      onClick: this.handleQuantityDecrease
    };

    const increaseBtnProps = {
      className: 'incr-btn',
      onClick: this.handleQuantityIncrease
    };

    // Do not allow to go less than 1 quantity.
    if (quantity === 1) {
      decreaseBtnProps.disabled = true;
    }

    return (
      <div className="count-input">
        <Button {...decreaseBtnProps}>–</Button>
        <span className="quantity">{this.props.quantity}</span>
        <Button {...increaseBtnProps}>+</Button>
      </div>
    );
  }
}

BasketQuantityWidget.propTypes = {
  dispatch: React.PropTypes.func,
  productId: React.PropTypes.string.isRequired,
  quantity: React.PropTypes.number.isRequired,
};

export default connect()(BasketQuantityWidget);
