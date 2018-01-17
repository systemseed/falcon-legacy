import React from 'react';
import PropTypes from 'prop-types';
import DonationButton from '../../atoms/DonationButton';
import { Button } from 'reactstrap';

class DonationForm extends React.Component {

  constructor(props) {
    const { currency, singleDonationUrl, regularDonationUrl, paypalDonationUrl, predefinedValues, buttonText } = props;
    super(props);

    this.state = {
      isSending: false,
      isRegular: true,
    };

    this.predefinedValue = [];
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    console.log(this);
    console.log(event.target);

    if (event.target.name == 'donate_monthly') {
      this.setState({
        isRegular: event.target.checked
      });
    }
    if (event.target.name == 'predefined_value') {
      this.donationAmount.value = event.target.nextSibling.innerHTML.match(/\d+/g);
    }
    if (event.target.name == 'donation_amount') {
      this.predefinedValue.forEach((element) => {
        element.checked = false;
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
          {/* Use ref here to uncheck radio buttons state in js. */}
          <input type="radio" name="predefined_value" id="predefined_value_1" ref={input => { this.predefinedValue[0] = input; }} onChange={this.handleChange} /><label for="predefined_value_1">£10</label>
          <input type="radio" name="predefined_value" id="predefined_value_2" ref={input => { this.predefinedValue[1] = input; }} onChange={this.handleChange} /><label for="predefined_value_2">£20</label>
          <input type="radio" name="predefined_value" id="predefined_value_3" ref={input => { this.predefinedValue[2] = input; }} onChange={this.handleChange} /><label for="predefined_value_3">£30</label>
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
            <button type="button" name="paypal" className="donate-by-paypal btn-with-border" onClick={this.handleSubmit}>Paypal</button>
          </div>
        </div>
        <Button color="primary" name="donate" onClick={this.handleSubmit}>{buttonText}</Button>
      </form>
    );
  }
}

DonationForm.propTypes = {
  currency: PropTypes.string,
  singleDonationUrl: PropTypes.string,
  regularDonationUrl: PropTypes.string,
  paypalDonationUrl: PropTypes.string,
  predefinedValues: PropTypes.arrayOf(PropTypes.number),
  buttonText: PropTypes.string
};

export default DonationForm;