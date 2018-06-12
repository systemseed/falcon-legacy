import React, { PropTypes } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { connect } from 'react-redux';
import CwButton from '../CwButton';
import * as basketActions from '../../actions/basket';
import * as messageActions from '../../actions/messageBar';
import ArrowIcon from '../ArrowIcon';

class AddToBasketButton extends React.Component {
  addToBasketClicked = () => {
    const { product, dispatch, basketType } = this.props;

    dispatch(basketActions.addProduct(product));

    // Show "Added to basket" message only when current basket matches
    // product type. Otherwise popup with basket clear confirmation
    // will be shown, so no message needed.
    if (basketType === product.type || !basketType) {
      dispatch(messageActions.show(`Added! Go to basket ${renderToStaticMarkup(<ArrowIcon direction="right" />)}`, { link: '/basket' }));
    }
  };

  render = () => (
    <CwButton
      bsStyle="link"
      className="add-to-cart"
      onClick={() => this.addToBasketClicked()}
    >
      <em>Add to basket</em>
    </CwButton>
  );
}

AddToBasketButton.propTypes = {
  dispatch: PropTypes.func,
  product: PropTypes.shape({
    id: React.PropTypes.string,
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    categoryId: React.PropTypes.string,
    variantType: React.PropTypes.string,
    annotation: React.PropTypes.string,
    description: React.PropTypes.string,
    price: React.PropTypes.object,
    imageUrl: React.PropTypes.string,
    actionImageUrl: React.PropTypes.string,
    actionDescription: React.PropTypes.string,
  }).isRequired,
  basketType: PropTypes.string,
};

const mapStateToProps = state => ({
  basketType: state.basket.type
});

export default connect(mapStateToProps)(AddToBasketButton);
