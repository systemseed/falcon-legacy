import React from 'react';
import PropTypes from 'prop-types';
import DonationButton from '../../atoms/DonationButton';
import Heading1 from '../../atoms/Heading1';
import SubHeading from '../../atoms/SubHeading';
import PlainText from '../../atoms/PlainText';
import PaypalButton from '../../atoms/PaypalButton';
import Sticky from '../../atoms/Sticky';

class PageTitleCopyDonateBlock extends React.Component {

  constructor(props) {
    super(props);

    const regularAvailable = (props.regularDonationUrl.length > 0) ? true : false;
    this.state = {
      isSending: false,
      regularAvailable,
      regularChecked: regularAvailable
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    if (event.target.name == 'donate_monthly') {
      this.setState({
        regularChecked: event.target.checked
      });
    }
  }

  handleSubmit(event) {
    const {regularDonationUrl, singleDonationUrl} = this.props;
    let donationUrl = this.state.regularAvailable ? regularDonationUrl : singleDonationUrl;

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
    const {buttonText, heading, subheading, copy} = this.props;
    return (
      <div className="copy-with-title-and-subtitle">
        <Heading1>{heading}</Heading1>
        <SubHeading>{subheading}</SubHeading>

        <div className="copy-with-title-and-subtitle__donate-block">
          <PlainText className="d-none d-sm-block">{copy}</PlainText>

          <div className="donation-form-short-block d-md-none">

            <div className="sticky-donation-button-wrapper d-sm-none">
              <Sticky className="sticky-donation-button">
                <DonationButton block color="secondary" size="lg" name="donate"
                                onClick={this.handleSubmit}>{buttonText}</DonationButton>
              </Sticky>
            </div>

            <DonationButton block className="d-none d-sm-block" color="secondary" size="lg" name="donate"
                            onClick={this.handleSubmit}>{buttonText}</DonationButton>

            {/* @todo: Move Regular checkbox and button to separate component */}
            <div className="donation-form-block__monthly">
              <div className="donate-monthly">
                {this.state.regularAvailable &&
                <div>
                  <input type="checkbox" name="donate_monthly" id="donate-monthly" onChange={this.handleChange}
                         checked={this.state.regularChecked}/>
                  <label htmlFor="donate-monthly">Donate Monthly</label>
                </div>
                }
              </div>
              <div className="donate-paypal">
                <PaypalButton outline size="sm" color="grey" onClick={this.handleSubmit} />
              </div>
            </div>

          </div>
        </div>

        {/* Show copy after Donate block on Small screens */}
        <PlainText className="d-sm-none">{copy}</PlainText>
      </div>
    );
  }
}

PageTitleCopyDonateBlock.propTypes = {
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string,
  copy: PropTypes.string.isRequired,
  singleDonationUrl: PropTypes.string,
  regularDonationUrl: PropTypes.string,
  buttonText: PropTypes.string
};

export default PageTitleCopyDonateBlock;