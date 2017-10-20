import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import BasketTotal from '../BasketTotal';

const BasketEmpty = ({ currentCurrency }) => (
  <Grid>
    <h1 className="space-top-half">Shopping Basket</h1>

    <Row className="padding-top">

      <Col sm={8} className="padding-bottom-2x">
        <p>
          Your basket is empty.
        </p>

      </Col>

      <Col md={3} mdOffset={1} sm={4} className="padding-bottom-2x">
        <aside>
          <h3 className="toolbar-title">Basket total:</h3>
          <h4 className="amount">
            <BasketTotal
              total={0}
              currentCurrency={currentCurrency}
            />
          </h4>
        </aside>
      </Col>

    </Row>
  </Grid>
);

BasketEmpty.propTypes = {
  currentCurrency: React.PropTypes.string.isRequired,
};

export default BasketEmpty;
