import React from 'react';
import PropTypes from 'prop-types';
import DonationButton from '../../atoms/DonationButton';
import Heading1 from '../../atoms/Heading1';
import SubHeading from '../../atoms/SubHeading';
import PlainText from '../../atoms/PlainText';
import PaypalButton from '../../atoms/PaypalButton';
import Sticky from '../../atoms/Sticky';

class Heading1WithSubheadingAndCopy extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isSending: false,
      isRegular: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    if (event.target.name == 'donate_monthly') {
      this.setState({
        isRegular: event.target.checked
      });
    }
  }

  handleSubmit(event) {
    const { regularDonationUrl, singleDonationUrl } = this.props;
    let donationUrl = this.state.isRegular ? regularDonationUrl : singleDonationUrl;

    let queryParams = [];
    if (event.target.name !== 'donate') {
      queryParams.push('payment_menthod=' + event.target.name);
    }
    if (queryParams.length > 0) {
      const symb = donationUrl.indexOf('?') > -1 ? '&' : '?';
      donationUrl += symb + queryParams.join('&');
    }

    this.setState({
      isSending: true
    });

    window.location = donationUrl;
  }

  render() {
    const { buttonText, heading, subheading, copy } = this.props;
    return(
      <div className="copy-with-title-and-subtitle">
        <Heading1>{heading}</Heading1>
        <SubHeading>{subheading}</SubHeading>

        <div className="copy-with-title-and-subtitle__donate-block">
          <PlainText>{copy}</PlainText>

          <div className="donation-form-short-block d-md-none">

            <div className="sticky-donation-button-wrapper d-sm-none">
              <Sticky className="sticky-donation-button">
                <DonationButton block color="secondary" size="lg" name="donate" onClick={this.handleSubmit}>{buttonText}</DonationButton>
              </Sticky>
            </div>

            <DonationButton block className="d-none d-sm-block" color="secondary" size="lg" name="donate" onClick={this.handleSubmit}>{buttonText}</DonationButton>

            <div className="donation-form-block__monthly">
              <div className="donate-monthly">
                <input type="checkbox" name="donate_monthly" id="donate-monthly" onChange={this.handleChange} checked={this.state.isRegular}/><label htmlFor="donate-monthly">Donate Monthly</label>
              </div>
              <div className="donate-paypal">
                <PaypalButton outline size="sm" color="grey" onClick={this.handleSubmit} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Heading1WithSubheadingAndCopy.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  copy: PropTypes.string,
  singleDonationUrl: PropTypes.string,
  regularDonationUrl: PropTypes.string,
  buttonText: PropTypes.string
};

export default Heading1WithSubheadingAndCopy;