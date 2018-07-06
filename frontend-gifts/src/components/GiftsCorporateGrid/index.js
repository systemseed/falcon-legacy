import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import GiftsCorporateGridItem from '../GiftsCorporateGridItem';

const GiftsGridCorporate = ({ gifts, currentCurrency }) => {
  const products = gifts.map(product =>
    <Col sm={6} key={product.id}>
      <GiftsCorporateGridItem
        productData={product}
        currentCurrency={currentCurrency}
      />
    </Col>
  );

  return (
    <Grid
      componentClass="section"
      className="gifts-grid corporate"
      bsClass=""
    >
      <div className="bg-white padding-horizontal-150-xl padding-bottom-2x">
        <Row className="padding-top">
          {products}
        </Row>
      </div>

    </Grid>
  );
};

GiftsGridCorporate.propTypes = {
  gifts: React.PropTypes.arrayOf(
    React.PropTypes.shape({
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
    })
  ),
  currentCurrency: React.PropTypes.string.isRequired,
};

export default GiftsGridCorporate;
