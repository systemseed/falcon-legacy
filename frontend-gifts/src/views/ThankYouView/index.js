import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import Metatags from '../../components/Metatags';
import FeaturedImage from '../../containers/FeaturedImageContainer';
import { checkoutComplete } from '../../actions/checkout';
import * as messageActions from '../../actions/messageBar';
import * as analyticsActions from '../../actions/analytics';

class ThankYouView extends Component {
  defaultProps = {
    orderId: ''
  };

  orderId = '';

  componentWillMount() {
    const { match, orderId, dispatch } = this.props;
    if (match.params.orderId === orderId) {
      // Copy order id before cleaning up all checkout data.
      this.orderId = orderId;
      // Let analytics know that the order has been completed.
      dispatch(analyticsActions.ecommercePurchase());
      // Finalize checkout.
      dispatch(checkoutComplete());
      dispatch(messageActions.hide());
    }
  }

  render() {
    return (
      <div>
        <Metatags metatags={{ 'title': { 'attributes': { 'content': 'Thank you | Falcon Gifts' } } }} />
        <FeaturedImage uuid="345ac52f-8b2f-4447-bb10-2859cf08f3f1" />
        <Grid>
          <div className="bg-white padding-horizontal-150-xl padding-top-3x padding-bottom-2x">
            <Row>
              <Col xs={12}>
                <h1>Your life-changing order is complete!</h1>
                <p>Thanks for purchasing Falcon Gifts. Your generous support is much appreciated and will truly help
                  improve the lives of people living in the world’s poorest countries.</p>
                <p>We’ll be in touch shortly with further details.</p>
              </Col>
            </Row>
          </div>
        </Grid>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  orderId: state.checkout.order.order_id
});

ThankYouView.propTypes = {
  orderId: PropTypes.string,
  match: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(mapStateToProps)(ThankYouView);
