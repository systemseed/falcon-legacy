import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import CheckoutFormContainer from '../../CheckoutFormContainer';

class CheckoutGiftAid extends Component {

  giftAidTitle = 'I would like Falcon to reclaim the tax I have paid on this donation, any donation I have made in the previous four years, and any donations I may make in the future. I am a UK taxpayer.';
  schema = {
    title: '',
    type: 'object',
    required: [],
    properties: {
      field_order_gift_aid: { title: this.giftAidTitle, type: 'boolean' }
    }
  };

  uiSchema = {
    field_order_gift_aid: { 'classNames': 'text-gray text-sm' }
  };

  componentDidMount() {
    // Force set default values to state.
    const defaultFrom = {
      field_profile_prefs_sms: false
    };
    this.props.onFormValidate(defaultFrom, true);
  }

  render() {
    return (
      <Row>
        <Col xs={12} className="giftaid-container">
          <h3>Increase the value of your gift by 25%</h3>
          <Row>
            <Col sm={3} className="hidden-xs giftaid-image">
              <img src="/images/giftaid.png" width="128" height="45" alt="" />
            </Col>
            <Col xs={12} sm={9} className="giftaid-checkbox">
              <CheckoutFormContainer
                schema={this.schema}
                uiSchema={this.uiSchema}
                formClass=""
                {...this.props}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

CheckoutGiftAid.propTypes = {
  onFormValidate: PropTypes.func.isRequired
};

export default CheckoutGiftAid;
