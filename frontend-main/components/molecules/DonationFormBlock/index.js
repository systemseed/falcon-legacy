import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from 'reactstrap';

class DonationForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isSending: false,
      isRegular: true,
      rSelected: null
    };

    this.handleRadioBtnClick = this.handleRadioBtnClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleRadioBtnClick(event, rSelected) {
    this.setState({ rSelected });
    this.donationAmount.value = event.target.innerHTML.match(/\d+/g);
  }

  handleChange(event) {
    console.log(this);
    console.log(event.target);

    if (event.target.name == 'donate_monthly') {
      this.setState({
        isRegular: event.target.checked
      });
    }

    if (event.target.name == 'donation_amount') {
      this.setState({
        rSelected: null
      });
    }

  }

  handleSubmit(event) {
    console.log(this.state);
    const { regularDonationUrl, singleDonationUrl } = this.props;
    let donationUrl = this.state.isRegular ? regularDonationUrl : singleDonationUrl;

    let queryParams = [];
    console.log(this.donationAmount.value);
    if (this.donationAmount.value > 0) {
      queryParams.push('amount=' + this.donationAmount.value);
    }
    if (event.target.name !== 'donate') {
      queryParams.push('method=' + event.target.name);
    }
    if (queryParams.length > 0) {
      const symb = donationUrl.indexOf('?') > -1 ? '&' : '?';
      donationUrl += symb + queryParams.join('&');
    }

    this.setState({
      isSending: true
    });

    console.log('donationUrl', donationUrl);
    console.log('submitForm props', this.props);

    //window.location = donationUrl;
  }

  render() {
    console.log('render', this.state);
    const { buttonText } = this.props;
    return(
      <form className="donation-form-block" onSubmit={this.handleSubmit}>
        <div className="donation-form-block__predefined-values">
          <ButtonGroup>
            <Button outline color="grey" onClick={(event) => this.handleRadioBtnClick(event, 1)} active={this.state.rSelected === 1}>£10</Button>
            <Button outline color="grey" onClick={(event) => this.handleRadioBtnClick(event, 2)} active={this.state.rSelected === 2}>£20</Button>
            <Button outline color="grey" onClick={(event) => this.handleRadioBtnClick(event, 3)} active={this.state.rSelected === 3}>£30</Button>
          </ButtonGroup>
        </div>
        <div className="donation-form-block__donation-amount">
          {/* Use ref here instead of state values to have an ability to get field value set by A/B tools (by js). */}
          <input type="text" name="donation_amount" className="donation-amount" ref={input => { this.donationAmount = input; }} onChange={this.handleChange} />
        </div>
        <div className="donation-form-block__monthly">
          <div className="donate-monthly">
            <input type="checkbox" name="donate_monthly" id="donate-monthly" onChange={this.handleChange} checked={this.state.isRegular}/><label for="donate-monthly">Donate Monthly</label>
          </div>
          <div className="donate-paypal">
            <Button outline color="grey" name="donate" onClick={this.handleSubmit}>Paypal</Button>
          </div>
        </div>
        <Button block color="secondary" size="lg" name="donate" onClick={this.handleSubmit}>{buttonText}</Button>
      </form>
    );
  }
}

DonationForm.propTypes = {
  currency: PropTypes.string,
  singleDonationUrl: PropTypes.string,
  regularDonationUrl: PropTypes.string,
  predefinedValues: PropTypes.arrayOf(PropTypes.number),
  buttonText: PropTypes.string
};

export default DonationForm;