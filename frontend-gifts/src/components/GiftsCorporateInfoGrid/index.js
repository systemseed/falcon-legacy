import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import imgOrder from '../../styles/img/corporate/order.jpg';
import imgYouGet from '../../styles/img/corporate/what-you-get.jpg';
import imgBenefit from '../../styles/img/corporate/benefit.jpg';
import imgHope from '../../styles/img/corporate/hope.jpg';

const GiftsCorporateInfoGrid = () => (
  <Grid
    componentClass="section"
    bsClass="container"
  >
    <div className="bg-white padding-top-3x container__corporate-info">

      <h3 className="text-center">
        How do Corporate Gifts work?
      </h3>

      <Row>
        {/* The first tile */}
        <Col sm={6}>
          <div className="category-tile">
            <div className="inner">

              <div className="column">
                <h3 className="space-bottom-half">
                  1. Order
                </h3>
                <p>Choose your gift below and make your order online, or by phone on (01) 111 1001</p>
              </div>

              <div className="column">
                <div className="category-thumb">
                  <img src={imgOrder} alt="Order" />
                </div>
              </div>

            </div>
          </div>
        </Col>

        {/* The second tile */}
        <Col sm={6}>
          <div className="category-tile">
            <div className="inner">

              <div className="column">
                <h3 className="space-bottom-half">
                  2. What you get
                </h3>
                <ul>
                  <li>Web banner / email signature</li>
                  <li>Thank You certificate</li>
                  <li>eCard</li>
                  <li>A letter to send to your clients</li>
                </ul>
              </div>

              <div className="column">
                <div className="category-thumb">
                  <img src={imgYouGet} alt="What you get" />
                </div>
              </div>

            </div>
          </div>
        </Col>

        {/* The third tile */}
        <Col sm={6}>
          <div className="category-tile">
            <div className="inner">

              <div className="column">
                <h3 className="space-bottom-half">
                  3. Additional benefit
                </h3>
                <p>Your company will also have the option of appearing in our Thank You ad in the Irish Times on Friday
                  22nd December.</p>
              </div>

              <div className="column">
                <div className="category-thumb">
                  <img src={imgBenefit} alt="Additional benefit" />
                </div>
              </div>

            </div>
          </div>
        </Col>

        {/* The fourth tile */}
        <Col sm={6}>
          <div className="category-tile">
            <div className="inner">

              <div className="column">
                <h3 className="space-bottom-half">
                  4. Change lives
                </h3>
                <p>Give stronger futures, poverty-breaking tools and strengthened livelihoods</p>
              </div>

              <div className="column">
                <div className="category-thumb">
                  <img src={imgHope} alt="Hope" />
                </div>
              </div>

            </div>
          </div>
        </Col>

      </Row>
    </div>
  </Grid>
);

export default GiftsCorporateInfoGrid;
