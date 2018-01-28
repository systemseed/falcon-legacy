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
    let donationUrl = this.props.href;

    // Gets an amount from Button text.
    const amount = event.target.innerHTML.match(/\d+/g);
    if (amount !== undefined && amount > 0) {
      const symb = donationUrl.indexOf('?') > -1 ? '&' : '?';

      donationUrl += symb + 'amount=' + amount;
    }

    window.location = donationUrl;
  }

  render() {
    const { href, children, ...attributes } = this.props;
    return(
      <DonationButton href={href} onClick={this.handleClick} {...attributes}>{children}</DonationButton>
    );
  }
}

ButtonWithAmount.propTypes = {
  href: PropTypes.string
};

export default ButtonWithAmount;