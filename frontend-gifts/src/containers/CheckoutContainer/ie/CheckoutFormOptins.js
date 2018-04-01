import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import CheckoutFormContainer from '../../CheckoutFormContainer';

// ROI opt-ins. See https://www.pivotaltracker.com/story/show/151721573.
class CheckoutFormOptins extends Component {

  schema = {
    title: '',
    type: 'object',
    required: [],
    properties: {
      field_profile_prefs_phone: { title: 'Phone', type: 'boolean', default: false },
      field_profile_prefs_email: { title: 'Email', type: 'boolean', default: false },
      field_profile_prefs_sms: { title: 'SMS', type: 'boolean', default: false }
    }
  };

  uiSchema = {
    field_profile_prefs_phone: { 'classNames': 'checkbox-inline' },
    field_profile_prefs_email: { 'classNames': 'checkbox-inline' },
    field_profile_prefs_sms: { 'classNames': 'checkbox-inline' }
  }

  componentDidMount() {
    // Force set default values to state.
    // Without this step payment buttons won't appear on page.
    const defaultFrom = {
      field_profile_prefs_sms: false,
      field_profile_prefs_phone: false,
      field_profile_prefs_email: false,
    };
    this.props.onFormValidate(defaultFrom, true);
  }

  render() {
    const { description, onFormValidate } = this.props;
    return (
      <Row>
        <Col xs={12}>
          {description &&
          <p className="text-gray text-sm" dangerouslySetInnerHTML={{ __html: description }} />
          }
          <CheckoutFormContainer
            schema={this.schema}
            uiSchema={this.uiSchema}
            onFormValidate={onFormValidate}
            formClass="options"
          />
        </Col>
      </Row>
    );
  }
}

CheckoutFormOptins.propTypes = {
  onFormValidate: PropTypes.func.isRequired,
  description: PropTypes.string
};

export default CheckoutFormOptins;
