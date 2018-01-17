import React from 'react';
import DonationButton from '../../atoms/DonationButton';

class FormButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...props.formData};
  }
  onChange() {
    return () => {
      this.setState({
        isClicked: true
      }, () => this.props.onChange(this.state));
    };
  }
  render() {
    return (
      <DonationButton onClick={this.onChange()}>Paypal</DonationButton>
    );
  }
}

export default FormButton;