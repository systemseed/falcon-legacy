import React from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import { Link } from 'react-router-dom';
import * as messageActions from '../../actions/messageBar';

// Map message type with material-icons class.
const typeClasses = {
  status: 'check',
  warning: 'warning',
  error: 'error_outline',
};

class MessageBarContainer extends React.Component {

  componentDidUpdate() {
    const { dispatch, visible, options } = this.props;
    if (visible) {
      // Hide message after given amount of seconds.
      setTimeout(() => dispatch(messageActions.hide()), options.timeout);
    }
  }

  render = () => {
    const { type, link } = this.props.options;
    const wrapperClasses = `message-bar type-${type} bg-${type}${this.props.visible ? ' visible' : ''}`;
    const iconClasses = `material-icons ${typeClasses[type]}`;

    if (!_isEmpty(link)) {
      return <Link className={wrapperClasses} to={link}><span className={iconClasses} /><span dangerouslySetInnerHTML={{ __html: this.props.message }} /></Link>;
    }
    return <div className={wrapperClasses}><span className={iconClasses} /><span dangerouslySetInnerHTML={{ __html: this.props.message }} /></div>;
  };
}

MessageBarContainer.propTypes = {
  dispatch: React.PropTypes.func,
  visible: React.PropTypes.bool,
  message: React.PropTypes.string.isRequired,
  options: React.PropTypes.shape({
    type: React.PropTypes.string, // status, warning, error
    timeout: React.PropTypes.number,
    link: React.PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  visible: state.messageBar.isVisible,
  message: state.messageBar.message,
  options: state.messageBar.options,
});

export default connect(mapStateToProps)(MessageBarContainer);
