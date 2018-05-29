import React, { Component, PropTypes } from 'react';
import Form from 'react-jsonschema-form';
import { Row } from 'react-bootstrap';
import { FieldTemplateCheckout } from '../../utils/forms';

// This is a "master" component to render and manage parts of checkout form.
// See CheckoutFormProfile for usage example.
class CheckoutFormContainer extends Component {

  // Flag to let onValidate know this is initial state of form data.
  inited = false;
  validated = false;

  shouldComponentUpdate() {
    // Disable re-rendering of this component.
    return false;
  }

  transformErrors(errors) {
    // transformErrors is called right before "onValidate" and passes
    // an array of built-in errors. We store this data because there is no
    // easy way to get it later in onValidate callback.
    this.validated = !errors.length;

    return errors;
  }

  onValidate(formData, errors) {
    // Small styling improvement: manually validate required fields to make sure
    // .has-error class has been added to all empty fields.
    this.props.schema.required.forEach((field) => {
      if (!formData[field]) {
        errors[field].addError('The field is required');
      }
    });

    if (this.inited) {
      // Send data to store so other parts of checkout form can use it.
      this.props.onFormValidate(formData, this.validated);
    }
    else {
      // Skip very first validation call (empty object).
      this.inited = true;
    }

    return errors;
  }

  render() {
    // Add tooltips data to uiSchema, used in FieldTemplate.
    const { tooltips, uiSchema } = this.props;
    Object.keys(uiSchema).forEach((key) => {
      if (tooltips[key]) {
        uiSchema[key]['ui:tooltip'] = tooltips[key];
      }
    });

    return (
      <Row>
        <Form
          // We pass empty formData to initialize validation.
          // Note that re-rendering is disabled for this component that's why
          // we don't need to keep formData value up to date with user input.
          formData={{}}
          schema={this.props.schema}
          uiSchema={uiSchema}
          validate={this.onValidate.bind(this)}
          FieldTemplate={FieldTemplateCheckout}
          className={this.props.formClass}
          /* Below is magic to validate form data on the fly. */
          liveValidate
          noHtml5Validate
          showErrorList={false}
          transformErrors={this.transformErrors.bind(this)}
          onChange={this.props.onChange}
        >
          <button
            type="submit" ref={(el) => {
              this.submitButtonRef = el;
            }}
            style={{ display: 'none' }}
          >Submit</button>
        </Form>
      </Row>
    );
  }
}

CheckoutFormContainer.propTypes = {
  onFormValidate: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  formClass: PropTypes.string.isRequired,
  tooltips: PropTypes.object,
  onChange: PropTypes.func
};

CheckoutFormContainer.defaultProps = {
  onChange: () => {}
};

export default CheckoutFormContainer;
