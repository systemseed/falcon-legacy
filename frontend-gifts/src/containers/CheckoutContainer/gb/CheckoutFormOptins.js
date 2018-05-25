import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import CheckoutFormContainer from '../../CheckoutFormContainer';

// To be updated in this ticket: https://www.pivotaltracker.com/n/projects/1155390/stories/148679037
class CheckoutFormOptins extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    const optInUncheckedTitles = {
      field_profile_prefs_email: 'Tick to confirm we can contact you by email',
      field_profile_prefs_phone: 'Tick to confirm we can contact you by phone',
      field_profile_prefs_sms: 'Tick to confirm we can contact you by text',
      field_profile_prefs_post: <div>Tick if you <strong>do not</strong> wish to be contacted by post </div>,
    };

    const optInCheckedTitles = {
      field_profile_prefs_email: 'We can contact you by email',
      field_profile_prefs_phone: 'We can contact you by phone',
      field_profile_prefs_sms: 'We can contact you by text',
      field_profile_prefs_post: <div> We <strong>will not</strong> contact you by post </div>,
    };

    this.state = {
      formData: {},
      key: '0000',
      optInUncheckedTitles,
      optInCheckedTitles,
      schema: {
        title: '',
        type: 'object',
        required: [],
        properties: {
          field_profile_prefs_email: {
            title: optInUncheckedTitles.field_profile_prefs_email,
            type: 'boolean',
            default: false
          },
          field_profile_prefs_phone: {
            title: optInUncheckedTitles.field_profile_prefs_phone,
            type: 'boolean',
            default: false
          },
          field_profile_prefs_sms: {
            title: optInUncheckedTitles.field_profile_prefs_sms,
            type: 'boolean',
            default: false
          },
          field_profile_prefs_post: {
            title: optInUncheckedTitles.field_profile_prefs_post,
            type: 'boolean',
            default: false
          },
        }
      }
    };
  }

  uiSchema = {};

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

  onChange({ formData }) {
    const state = this.state;

    // THIS IS A WORKAROUND: we are generating unique key to create completely new CheckoutFormContainer component
    // every time change happens in that component. This is a workaround because "react-jsonschema-form" does not
    // support shcema updates for now.
    let key = '';

    const optInfields = Object.keys(formData);

    optInfields.forEach((optInField) => {
      // Calculating a key based on formData field boolean values.
      key += formData[optInField] ? '1' : '0';
      if (formData[optInField]) {
        state.schema.properties[optInField].title = state.optInCheckedTitles[optInField];
        state.schema.properties[optInField].default = true;
      }
      else {
        state.schema.properties[optInField].title = state.optInUncheckedTitles[optInField];
        state.schema.properties[optInField].default = false;
      }
    });

    state.key = key;

    this.setState({ schema: state.schema, formData });
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
            key={this.state.key}
            schema={this.state.schema}
            formData={this.state.formData}
            uiSchema={this.uiSchema}
            onFormValidate={onFormValidate}
            formClass="options"
            onChange={this.onChange}
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
