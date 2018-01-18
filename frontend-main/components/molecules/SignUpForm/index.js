import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';


class SignUpForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isSending: false,
    };

    this.submitForm.bind(this);
  }

  submitForm(event) {

    this.setState({
      isSending: true,
    });
  }

  render() {
    return(
      <Form className="sign-up-form">
        <Input className="email-address" type="email" name="email_address" placeholder="Your email address" />
        <Button className="submit-button" color="primary">Sign me up</Button>
      </Form>
    );
  }
}

export default SignUpForm;
