import React, { PropTypes } from 'react';
import * as basketUtils from '../../utils/basket';
import BasketItemRemoveBtn from '../BasketWithGifts/BasketItemRemoveBtn';
import BasketQuantityWidget from '../BasketWithGifts/BasketQuantityWidget';

const BasketItemControls = ({ product }) => {
  let className = 'item-controls';
  // Add custom class name if both widgets are visible.
  if (basketUtils.hasDeleteButton(product.data) && basketUtils.hasQuantityWidget(product.data)) {
    className += '-flex';
  }

  return (
    <div className={className}>
      {basketUtils.hasDeleteButton(product.data) &&
        <BasketItemRemoveBtn productId={product.id} />
      }
      {basketUtils.hasQuantityWidget(product.data) &&
        <BasketQuantityWidget
          quantity={basketUtils.getProductQuantity(product)}
          productId={product.id}
        />
      }
    </div>
  );
};


BasketItemControls.propTypes = {
  product: PropTypes.object,
};

export default BasketItemControls;
