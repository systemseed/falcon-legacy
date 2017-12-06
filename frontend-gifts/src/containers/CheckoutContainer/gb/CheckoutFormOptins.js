import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import CheckoutFormContainer from '../../CheckoutFormContainer';

// To be updated in this ticket: https://www.pivotaltracker.com/n/projects/1155390/stories/148679037
class CheckoutFormOptins extends Component {

  schema = {
    title: '',
    type: 'object',
    required: [],
    properties: {
      field_profile_prefs_sms: { title: 'SMS', type: 'boolean', default: true },
      field_profile_prefs_phone: { title: 'Phone', type: 'boolean', default: true },
      field_profile_prefs_post: { title: 'Post', type: 'boolean', default: true },
      field_profile_prefs_email: { title: 'Email', type: 'boolean', default: true },
    }
  };

  uiSchema = {
    field_profile_prefs_sms: { 'classNames': 'checkbox-inline' },
    field_profile_prefs_phone: { 'classNames': 'checkbox-inline' },
    field_profile_prefs_post: { 'classNames': 'checkbox-inline' },
    field_profile_prefs_email: { 'classNames': 'checkbox-inline' }
  }

  componentDidMount() {
    // Force set default values to state.
    const defaultFrom = {
      field_profile_prefs_sms: true,
      field_profile_prefs_phone: true,
      field_profile_prefs_post: true,
      field_profile_prefs_email: true,
    };
    this.props.onFormValidate(defaultFrom, true);
  }

  render() {
    return (
      <Row>
        <Col xs={12}>
          <p className="text-gray text-sm">We’d love to keep you updated about how your generous support is making a difference to our vital work tackling hunger and how you can help transform more lives through campaigning and appeals. We always keep your details safe and we never pass them on to other organisations. You can change your preferences at any time.</p>
          <CheckoutFormContainer
            schema={this.schema}
            uiSchema={this.uiSchema}
            onFormValidate={this.props.onFormValidate}
            formClass="options"
          />
        </Col>
      </Row>
    );
  }
}


export default CheckoutFormOptins;
