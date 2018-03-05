import React from 'react';
import PropTypes from 'prop-types';
import PaypalButton from '../../atoms/PaypalButton';
import { Form, Button, ButtonGroup } from 'reactstrap';
import DonationButton from '../../atoms/DonationButton';
import { getCurrencySymbol } from '../../../utils/currency';
import AmountWithCurrency from '../../atoms/AmountWithCurrency';

class DonationForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isRegular: true,
      rSelected: null // No radio buttons active by default.
    };

    this.handleRadioBtnClick = this.handleRadioBtnClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleRadioBtnClick(event, rSelected) {
    this.setState({ rSelected });

    // Read Button value from Button text and update Amount field. Used this way to get values updated by external js scripts (VWO).
    let value = event.target.innerHTML.match(/\d+/g);
    if (Array.isArray(value) && value !== undefined) {
      value = value[0];
    }

    this.donationAmount.value = value;
  }

  handleChange(event) {
    // Donate monthly checkbox.
    if (event.target.name == 'donate_monthly') {
      this.setState({
        isRegular: event.target.checked
      });
    }

    // Unselect all radio buttons if user updated value in Donation amount field.
    if (event.target.name == 'donation_amount') {
      this.setState({
        rSelected: null
      });
    }

  }

  handleSubmit(event) {
    const { regularDonationUrl, singleDonationUrl } = this.props;
    let donationUrl = this.state.isRegular ? regularDonationUrl : singleDonationUrl;
    event.preventDefault();

    let queryParams = [];
    if (this.donationAmount.value > 0) {
      // Adds amount value to the link url.
      queryParams.push('amount=' + this.donationAmount.value);
    }
    if (event.target.name !== 'donate') {
      // Adds payment method to the link url.
      queryParams.push('payment_menthod=' + event.target.name);
    }
    if (queryParams.length > 0) {
      const symb = donationUrl.indexOf('?') > -1 ? '&' : '?';
      donationUrl += symb + queryParams.join('&');
    }

    window.location = donationUrl;
  }

  render() {
    const { buttonText, currencyCode, predefinedValues } = this.props;
    return(
      <Form className="donation-form-block" onSubmit={this.handleSubmit}>

        <div className="donation-form-block__predefined-values">
          <ButtonGroup>
            {
              predefinedValues
                .map((value, i) => {
                  return (
                    <Button key={i} outline size="sm" className="btn-predefined-value" color="grey" onClick={(event) => this.handleRadioBtnClick(event, i)} active={this.state.rSelected === i}>{getCurrencySymbol(currencyCode) + value}</Button>
                  )
                })
            }
          </ButtonGroup>
        </div>

        <div className="donation-form-block__donation-amount">
          {/* Use ref here instead of state values to have an ability to get field value set by A/B tools (by js). */}
          <AmountWithCurrency name="donation_amount" currencyCode={currencyCode} innerRef={input => { this.donationAmount = input; }} onChange={this.handleChange} />
        </div>

        <div className="donation-form-block__monthly">
          <div className="donate-monthly">
            <input type="checkbox" name="donate_monthly" id="donate-monthly" onChange={this.handleChange} checked={this.state.isRegular}/><label htmlFor="donate-monthly">Donate Monthly</label>
          </div>
          <div className="donate-paypal">
            <PaypalButton outline size="sm" color="grey" onClick={this.handleSubmit} />
          </div>
        </div>

        <DonationButton block color="secondary" size="lg" name="donate" onClick={this.handleSubmit}>{buttonText}</DonationButton>
      </Form>
    );
  }
}

DonationForm.propTypes = {
  currencyCode: PropTypes.string,
  singleDonationUrl: PropTypes.string.isRequired,
  regularDonationUrl: PropTypes.string.isRequired,
  predefinedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonText: PropTypes.string
};

export default DonationForm;