import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Sticky from 'react-stickynode';
import { Grid, Col, Row } from 'react-bootstrap';
import Metatags from '../../components/Metatags';
import CheckoutContainer from '../../containers/CheckoutContainer';
import CheckoutBasketSummary from '../../containers/CheckoutBasketSummary';
import CheckoutPaymentContainer from '../../containers/CheckoutPaymentContainer';

const CheckoutView = ({ siteContentSettings }) => (
  <div>
    <Metatags metatags={{ 'title': { 'attributes': { 'content': 'Checkout and save lives | Falcon Gifts' } } }} />
    <Grid>
      <div className="bg-white padding-horizontal-150-xl padding-top-3x padding-bottom-2x">
        <h1 className="space-top-half">
          {siteContentSettings.fieldConfigCheckoutPageTitle}
        </h1>

        <Row className="checkout-container padding-top">

          <Col sm={8} className="padding-bottom-2x sticky-bottom-boundary-checkout">
            <CheckoutContainer />
          </Col>

          <Col md={3} mdOffset={1} sm={4} className="padding-bottom-2x">
            <aside className="checkout-payment">
              <Sticky top={114} bottomBoundary=".sticky-bottom-boundary-checkout">
                <CheckoutBasketSummary />
                <CheckoutPaymentContainer />
              </Sticky>
            </aside>
          </Col>

        </Row>
      </div>
    </Grid>
  </div>
);

CheckoutView.propTypes = {
  siteContentSettings: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  siteContentSettings: state.siteContentSettings.data,
});

export default connect(mapStateToProps)(CheckoutView);
