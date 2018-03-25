import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import * as basketActions from '../../actions/basket';

class BasketClearButton extends React.Component {

  clearBasket = () => {
    this.props.dispatch(basketActions.clear());
  };

  render = () => (
    <Button onClick={this.clearBasket}>
      Clear Basket
    </Button>
  );

}

BasketClearButton.propTypes = {
  dispatch: PropTypes.func
};

export default connect()(BasketClearButton);
