import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import GiftsGridItem from '../../components/GiftsGridItem';

// Output products in bundle as a grid.
const BundleProductsViewContainer = ({ bundle, currency }) => (
  <div className="gift-in-this-bundle">
    <div className="row">
      <div className="col-xs-12">
        <h1 className="tile-gift-title">In This Bundle</h1>
        <p className="gift-in-this-bundle-description">With this bundle you get the following gifts:</p>
        <Grid bsClass="padding-bottom-3x" componentClass="section">
          <Row>
            {bundle.giftsInBundle.map(product => (
              <Col md={4} key={product.id}>
                <GiftsGridItem productData={product} currentCurrency={currency} showAddToBasket={false} />
              </Col>
            ))}
          </Row>
        </Grid>
      </div>
    </div>
  </div>
);

const mapStoreToProps = store => ({
  currency: store.currentCurrency
});

BundleProductsViewContainer.propTypes = {
  bundle: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired
};

export default connect(mapStoreToProps)(BundleProductsViewContainer);
