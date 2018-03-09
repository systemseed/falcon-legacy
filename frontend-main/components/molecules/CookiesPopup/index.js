import React from 'react';
import jsCookie from 'js-cookie';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

class CookiesPopup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    let cookies = jsCookie.get();
    this.setState({
      showPopup: cookies !== undefined && !cookies.hasOwnProperty(this.props.cookieName)
    });
  }

  handleSubmit(event) {

    jsCookie.set(this.props.cookieName, 2, { expires: 100 });
    this.setState({
      showPopup: false
    });
  }

  render () {
    const { policyUrl } = this.props;
    let classes = ['cookies-popup'];
    if (this.state.showPopup) {
      classes.push('visible');
    }
    return (
      <div className={classes.join(' ')}>
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