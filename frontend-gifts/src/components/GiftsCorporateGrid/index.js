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
      className="gifts-grid padding-top-3x space-top-half corporate"
    >

      <h3 className="text-center">
        Falcon Corporate Gifts - Give the gift of hope to children this year
      </h3>

      <Row className="padding-top">
        {products}
      </Row>

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
