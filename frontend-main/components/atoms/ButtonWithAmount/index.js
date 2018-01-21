import React from 'react';
import PropTypes from 'prop-types';
import DonationButton from '../../atoms/DonationButton';

class ButtonWithAmount extends React.Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    let donationUrl = this.props.href;
    const symb = donationUrl.indexOf('?') > -1 ? '&' : '?';

    donationUrl += symb + 'amount=' + event.target.innerHTML.match(/\d+/g);

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