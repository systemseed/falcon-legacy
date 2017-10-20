import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import * as basket from '../../actions/basket';

// Render add to basket button.
class BuyNowButton extends Component {

  buyNowClick = () => {
    const { dispatch } = this.props;
    dispatch(basket.addProductWithRedirect(
      this.props.product, this.context.router
    ));
  };

  render = () => (
    <Button
      bsStyle="link"
      className="add-to-cart buy-now"
      onClick={this.buyNowClick}
    >
      <em>Buy Now</em>
    </Button>
  );
}

BuyNowButton.propTypes = {
  dispatch: PropTypes.func,
  product: PropTypes.object.isRequired,
};

BuyNowButton.contextTypes = {
  router: PropTypes.object.isRequired
};

// BuyNowButton doesn't listen to store (empty first param).
// BuyNowButton uses default 'dispatch' param from 'react-redux' to dispatch action.
export default connect()(BuyNowButton);
