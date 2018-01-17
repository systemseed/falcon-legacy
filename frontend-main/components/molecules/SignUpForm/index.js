import React from 'react';
import Form from '../../atoms/Form';
import Button from '../../atoms/DonationButton';

const schema = {
  'type': 'object',
  'required': ['email'],
  'properties': {
    'email': {
      'type': 'string',
      'title': 'Your email address',
    },
  }
};

const uiSchema = {
  'email': {
    'ui:placeholder': 'Your email address',
  },
};

class SignUpForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isSending: false,
      formData: {},
    };

    this.submitForm.bind(this);
  }

  submitForm({ formData }) {

    this.setState({
      isSending: true,
      formData,
    });
  }

  render() {
    return(
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={this.state.formData}
        autocomplete={'off'}
        onSubmit={this.submitForm.bind(this)}
      >
        <Button block>
          Login
        </Button>
      </Form>
    );
  }
}

export default SignUpForm;
