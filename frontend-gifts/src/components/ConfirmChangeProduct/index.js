import React, { PropTypes } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';

const ConfirmChangeProduct = ({ product, confirmCallback, cancelCallback }) => (
  <div>
    <p>Your basket can only contain one type of gifts. If you
      proceed with adding {product.title} then existing gifts
      will be removed.</p>
    <ButtonToolbar>
      <Button bsStyle="primary" onClick={confirmCallback}>Proceed</Button>
      <Button bsStyle="default" onClick={cancelCallback}>Cancel</Button>
    </ButtonToolbar>
  </div>
);

ConfirmChangeProduct.propTypes = {
  product: PropTypes.object.isRequired,
  confirmCallback: PropTypes.func.isRequired,
  cancelCallback: PropTypes.func.isRequired
};

export default ConfirmChangeProduct;
