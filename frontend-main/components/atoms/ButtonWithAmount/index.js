import React from 'react';
import PropTypes from 'prop-types';
import DonationButton from '../../atoms/DonationButton';

/**
 * Redirects to provided url with predefined amount value given from button text.
 */
class ButtonWithAmount extends React.Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    let donationUrl = this.props.buttonUrl;

    // Gets an amount from Button text.
    let amount = event.target.innerHTML.match(/\d+/g);
    if (Array.isArray(amount) && amount !== undefined) {
      amount = amount[0];
    }

    if (amount !== undefined && amount > 0) {
      const symb = donationUrl.indexOf('?') > -1 ? '&' : '?';

      donationUrl += symb + 'amount=' + amount;
    }

    window.location = donationUrl;
  }

  render() {
    const { children, buttonUrl, ...attributes } = this.props;
    return(
      <DonationButton onClick={this.handleClick} {...attributes}>{children}</DonationButton>
    );
  }
}

ButtonWithAmount.propTypes = {
  buttonUrl: PropTypes.string
};

export default ButtonWithAmount;