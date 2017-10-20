import React, { Component, PropTypes } from 'react';
import CheckoutFormContainer from '../CheckoutFormContainer';


class CheckoutFormEventCodes extends Component {

  schema = {
    title: '',
    type: 'object',
    required: ['field_event_code'],
    properties: {
      field_event_code: { title: 'How did you hear about us?', type: 'number' },
    }
  };

  uiSchema = {
    'field_event_code': { 'bsClassNames': 'col-sm-12 form-element form-select' }
  }

  render() {
    const schema = this.schema;
    const { codes, labels } = this.props;
    schema.properties.field_event_code.enum = codes;
    schema.properties.field_event_code.enumNames = labels;

    return (
      <CheckoutFormContainer
        schema={schema}
        uiSchema={this.uiSchema}
        formClass="event-codes"
        {...this.props}
      />
    );
  }
}

CheckoutFormEventCodes.propTypes = {
  codes: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  onFormValidate: PropTypes.func.isRequired
};

export default CheckoutFormEventCodes;
