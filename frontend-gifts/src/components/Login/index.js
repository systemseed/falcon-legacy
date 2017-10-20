import React, { Component, PropTypes } from 'react';
import Form from 'react-jsonschema-form';

const log = type => console.log.bind(console, type);

/**
 * Login component to show a simple login dialog for Drupal backend.
 */
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.schema = {
      title: 'Login',
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: { type: 'string', title: 'Username' },
        password: { type: 'string', title: 'Password' },
      }
    };
    this.uiSchema = {
      'username': {
        'ui:placeholder': '',
        'ui:help': 'Enter your username.'
      },
      'password': {
        'ui:widget': 'password',
        'ui:help': 'Enter the password that accompanies your username.'
      },
    };
  }

  // Submit handler for form
  handleSubmit = ({ formData }) => {
    // Pull the values from the form, the refs can be found in the form element
    // as an attribute ref=""
    const creds = { username: formData.username.trim(), password: formData.password.trim() };
    this.props.onLoginClick(creds);
  };

  render() {
    const { errorMessage } = this.props;

    return (
      <div>
        {errorMessage &&
          <p style={{ color: 'red' }}>{errorMessage}</p>
        }
        <Form
          schema={this.schema}
          uiSchema={this.uiSchema}
          onSubmit={this.handleSubmit}
          onError={log('errors')}
        />
      </div>
    );
  }
}

Login.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
};

export default Login;
