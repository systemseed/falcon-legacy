import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import GiftsGridItem from '../GiftsGridItem';

const GiftsGrid = ({ gifts, currentCurrency }) => {
  const products = gifts.map(product =>
    <Col md={4} sm={6} key={product.id}>
      <GiftsGridItem
        productData={product}
        currentCurrency={currentCurrency}
      />
    </Col>
  );

  return (
    <Grid bsClass="gifts-grid padding-bottom-3x" componentClass="section">
      <Row>
        {(products.length > 0) ?
          products :
          <div className="col-sm-12">
            <h5>There are no gifts in this price range. Please select another price range.</h5>
            <h5>Thank you.</h5>
          </div>
        }
      </Row>
    </Grid>
  );
};

GiftsGrid.propTypes = {
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
      imageAlt: React.PropTypes.string,
      actionImageUrl: React.PropTypes.string,
      actionImageAlt: React.PropTypes.string,
      actionDescription: React.PropTypes.string,
    })
  ),
  currentCurrency: React.PropTypes.string.isRequired,
};

export default GiftsGrid;
