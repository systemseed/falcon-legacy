import React from 'react';
import jsCookie from 'js-cookie';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

class CookiesPopup extends React.Component {

  constructor(props) {
    super(props);
    let cookies = jsCookie.get();
    this.state = {
      showPopup: cookies !== undefined && !cookies.hasOwnProperty(this.props.cookieName),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {

    jsCookie.set(this.props.cookieName, 2, { expires: 100 });
    this.setState({
      showPopup: false
    });
  }

  render () {
    if (!this.state.showPopup) {
      return null;
    }

    const { policyUrl } = this.props;
    return (
      <div className="cookies-popup">
        <div className="copy">
          By continuing to browse this site you are agreeing to our use of cookies in accordance with our <a href={policyUrl} target="_blank">Cookies Policy</a>.
        </div>
        <div className="buttons">
          <Button className="button-yes" color="none" onClick={this.handleSubmit}>Yes, I agree</Button>
          <Button className="button-no" color="none" href={policyUrl} target="_blank">No, I want to find out more</Button>
        </div>
      </div>
    );
  }
}

CookiesPopup.propTypes = {
  policyUrl: PropTypes.string,
  cookieName: PropTypes.string
};

CookiesPopup.defaultProps = {
  policyUrl: '/privacy#cookies',
  cookieName: 'cookie-agreed-en-1710'
};

export default CookiesPopup;