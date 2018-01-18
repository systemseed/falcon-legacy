import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';


class SignUpForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      email: event.target.value
    });
  }

  handleSubmit(event) {
    const { signUpUrl } = this.props;
    event.preventDefault();

    if (this.state.email) {
      const symb = signUpUrl.indexOf('?') > -1 ? '&' : '?';
      window.location = signUpUrl + symb + 'email=' + this.state.email;
    }
  }

  render() {
    return(
      <Form className="sign-up-form" onSubmit={this.handleSubmit}>
        <Input className="email-address" type="email" name="email_address" required onChange={this.handleChange} placeholder="Your email address" />
        <Button className="submit-button" color="primary" >Sign me up</Button>
      </Form>
    );
  }
}

export default SignUpForm;
