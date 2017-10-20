import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, Route } from 'react-router-dom';
import Product from '../../components/Product';
import Metatags from '../../components/Metatags';
import { getProduct } from '../../reducers';
import Access from '../Access';
import AdminProductNav from '../../components/AdminProductNav';

// Product page.
const ProductPageContainer = ({ product, currency, match }) => {
  if (!product) {
    return null;
  }

  return (
    <div>
      <Metatags metatags={product.field_metatags} />
      <Access userRole="gifts_manager">
        <AdminProductNav productId={product.id} />
      </Access>
      <Product productData={product} currency={currency} />
    </div>
  );
};

ProductPageContainer.propTypes = {
  product: PropTypes.object,
  currency: PropTypes.string
};

const mapStateToProps = (state, ownProps) => ({
    // Load product by it's id from router.
  product: getProduct(state, ownProps.match.params.productId),
  currency: state.currency
});

export default connect(
  mapStateToProps
)(ProductPageContainer);
