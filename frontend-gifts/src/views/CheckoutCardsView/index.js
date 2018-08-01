import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Sticky from 'react-stickynode';
import { Grid, Col, Row } from 'react-bootstrap';
import Metatags from '../../components/Metatags';
import CheckoutCardsContainer from '../../containers/CheckoutCardsContainer';
import CheckoutBasketSummary from '../../containers/CheckoutBasketSummary';
import CheckoutCardsContinueContainer from '../../containers/CheckoutCardsContinueContainer';
import CheckoutCardsSummary from '../../containers/CheckoutCardsSummary';
import CardsNav from '../../components/CardsNav';

const CheckoutCardsView = ({ siteContentSettings }) => (
  <div>
    <Metatags metatags={{ 'title': { 'attributes': { 'content': 'Checkout and save lives | Falcon Gifts' } } }} />
    <Grid>
      <div className="bg-white padding-horizontal-150-xl padding-top padding-bottom-2x checkout-cards-view">
        <CardsNav />
        <h1>
          {siteContentSettings.fieldConfigCheckoutPageTitle}
        </h1>

        <Row className="checkout-container checkout-cards-container padding-top">

          <Col xs={12} lg={7} className="padding-bottom-2x sticky-bottom-boundary-cards">
            <CheckoutCardsContainer />
          </Col>

          <Col lg={4} lgOffset={1} className="padding-bottom-2x hidden-xs hidden-sm hidden-md">
            <aside className="checkout-payment">
              <Sticky top={114} bottomBoundary=".sticky-bottom-boundary-cards">
                <CheckoutBasketSummary />
                <CheckoutCardsContinueContainer />
                <CheckoutCardsSummary />
              </Sticky>
            </aside>
          </Col>

        </Row>
      </div>
    </Grid>
  </div>
);

CheckoutCardsView.propTypes = {
  siteContentSettings: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  siteContentSettings: state.siteContentSettings.data,
});

export default connect(mapStateToProps)(CheckoutCardsView);
