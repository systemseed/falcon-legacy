import React from 'react';
import Form from 'react-jsonschema-form';
import { Col, Button, Clearfix } from 'react-bootstrap';

class AddDonationForm extends React.Component {

  schema = {
    'type': 'object',
    'required': ['amount'],
    'properties': {
      'amount': {
        'type': 'integer',
        'minimum': 1,
      }
    }
  };

  uiSchema = {
    'classNames': `col-xs-6 col-sm-5 currency-${this.props.currentCurrency}`,
    'amount': {
      'ui:widget': 'updown',
      'ui:placeholder': '0',
    }
  };

  render = () => {
    const { addDonationSubmit, buttonLabel, formData } = this.props;

    return (
      <div>
        <Form
          id="add-donation-form"
          schema={this.schema}
          uiSchema={this.uiSchema}
          onSubmit={addDonationSubmit}
          formData={formData}
        >
          <Col xs={6} sm={7}>
            <Button
              bsStyle="info"
              type="submit"
              className="btn-block space-top-none"
            >
              {buttonLabel}
            </Button>
          </Col>
        </Form>
        <Clearfix />
      </div>
    );
  }
}

AddDonationForm.propTypes = {
  buttonLabel: React.PropTypes.string.isRequired,
  addDonationSubmit: React.PropTypes.func.isRequired,
  currentCurrency: React.PropTypes.string.isRequired,
  formData: React.PropTypes.object,
};

export default AddDonationForm;
