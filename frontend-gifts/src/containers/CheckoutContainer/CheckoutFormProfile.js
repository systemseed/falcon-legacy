import React, { Component } from 'react';
import CheckoutFormContainer from '../CheckoutFormContainer';


class CheckoutFormProfile extends Component {

  schema = {
    title: '',
    type: 'object',
    required: ['field_profile_first_name', 'field_profile_last_name', 'field_profile_email'],
    properties: {
      field_profile_first_name: { title: 'First name', type: 'string', maxLength: 255 },
      field_profile_last_name: { title: 'Last name', type: 'string', maxLength: 255 },
      field_profile_email: { title: 'Email', type: 'string', format: 'email' },
      field_profile_phone: { title: 'Phone', type: 'string', maxLength: 255 }
    }
  };

  uiSchema = {
    field_profile_first_name: { 'ui:placeholder': ' ' },
    field_profile_last_name: { 'ui:placeholder': ' ' },
    field_profile_email: { 'ui:placeholder': 'your@email.com' },
    field_profile_phone: { 'ui:placeholder': ' ' },
  }


  render() {
    return (
      <CheckoutFormContainer
        schema={this.schema}
        uiSchema={this.uiSchema}
        formClass="profile"
        {...this.props}
      />
    );
  }
}


export default CheckoutFormProfile;
