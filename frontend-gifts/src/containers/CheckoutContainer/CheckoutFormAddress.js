import React, { Component } from 'react';
import CheckoutFormContainer from '../CheckoutFormContainer';
import * as addressUtils from '../../utils/address';

const countries = addressUtils.getCountries();

class CheckoutFormAddress extends Component {

  schema = {
    title: '',
    type: 'object',
    required: ['address_line1', 'locality', 'country_code'],
    properties: {
      address_line1: { title: 'Address Line 1', type: 'string' },
      address_line2: { title: 'Address Line 2', type: 'string' },
      locality: { title: 'Town', type: 'string' },
      administrative_area: { title: 'County',
        type: 'string',
        enum: addressUtils.getIrelandCounties()
      },
      country_code: {
        title: 'Country',
        type: 'string',
        default: 'IE',
        enum: Object.keys(countries),
        enumNames: Object.keys(countries).map(code => countries[code]),
      }
    }
  };

  schemaGB = {
    title: '',
    type: 'object',
    required: ['address_line1', 'locality', 'postal_code', 'country_code'],
    properties: {
      address_line1: { title: 'Address Line 1', type: 'string' },
      address_line2: { title: 'Address Line 2', type: 'string' },
      locality: { title: 'Town', type: 'string' },
      administrative_area: { title: 'County', type: 'string' },
      postal_code: { title: 'Postcode', type: 'string' },
      country_code: {
        title: 'Country',
        type: 'string',
        default: 'GB',
        enum: Object.keys(countries),
        enumNames: Object.keys(countries).map(code => countries[code]),
      }
    }
  };

  uiSchema = {
    address_line1: { 'ui:placeholder': ' ', 'bsClassNames': 'col-sm-12' },
    address_line2: { 'ui:placeholder': ' ' },
    locality: { 'ui:placeholder': ' ' },
    administrative_area: { 'bsClassNames': 'form-element form-select col-sm-6' },
    country_code: { 'bsClassNames': 'form-element form-select col-sm-6' },
  }

  uiSchemaGB = {
    address_line1: { 'ui:placeholder': ' ' },
    address_line2: { 'ui:placeholder': ' ' },
    locality: { 'ui:placeholder': ' ' },
    postal_code: { 'ui:placeholder': ' ' },
    country_code: { 'bsClassNames': 'form-element form-select col-sm-6' },
  }

  render() {
    const schema = this.props.region === 'gb' ? this.schemaGB : this.schema;
    const uiSchema = this.props.region === 'gb' ? this.uiSchemaGB : this.uiSchema;

    return (
      <CheckoutFormContainer
        schema={schema}
        uiSchema={uiSchema}
        formClass="address"
        {...this.props}
      />
    );
  }
}


export default CheckoutFormAddress;
