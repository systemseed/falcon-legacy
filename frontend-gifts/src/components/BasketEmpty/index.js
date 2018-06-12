import React from 'react';
import Sticky from 'react-stickynode';
import { Grid, Row, Col } from 'react-bootstrap';
import BasketTotal from '../BasketTotal';
import BasketNav from '../BasketNav';

const BasketEmpty = ({ currentCurrency }) => (
  <Grid>
    <div className="bg-white padding-horizontal-150-xl padding-top">
      <BasketNav withCheckout={false} />
      <h1 className="space-top">Shopping Basket</h1>

      <Row className="padding-top">

        <Col sm={8} className="padding-bottom-2x sticky-bottom-boundary-basket">
          <p>
            Your basket is empty.
          </p>

        </Col>

        <Col md={3} mdOffset={1} sm={4} className="padding-bottom-2x">
          <aside>
            <Sticky top={114} bottomBoundary=".sticky-bottom-boundary-basket">
              <h3 className="toolbar-title">Basket total:</h3>
              <h4 className="amount">
                <BasketTotal
                  total={0}
                  currentCurrency={currentCurrency}
                />
              </h4>
            </Sticky>
          </aside>
        </Col>

      </Row>
    </div>
  </Grid>
);

BasketEmpty.propTypes = {
  currentCurrency: React.PropTypes.string.isRequired,
};

export default BasketEmpty;
