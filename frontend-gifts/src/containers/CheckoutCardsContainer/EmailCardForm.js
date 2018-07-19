import React, { Component, PropTypes } from 'react';
import { Row, Col, Panel } from 'react-bootstrap';
import classNames from 'classnames';
import { connect } from 'react-redux';
import CheckoutFormContainer from '../CheckoutFormContainer';

class EmailCardForm extends Component {

  state = {
    showErrors: false
  };

  schema = {
    title: '',
    type: 'object',
    required: ['field_friends_name', 'field_friends_email'],
    properties: {
      field_friends_name: {
        type: 'string', title: 'Recipient’s Name'
      },
      field_friends_email: {
        type: 'string', format: 'email', title: 'Recipient’s Email'
      },
      field_message: {
        type: 'string', maxLength: 500, title: 'Message'
      },
      sending_date: {
        type: 'string',
        // title: 'When would you like to send it?',
        title: ' ',
      }
    }
  };

  uiSchema = {
    field_friends_name: {
      'ui:placeholder': ' ',
      'bsClassNames': 'col-sm-6 field-friends-name'
    },
    field_friends_email: {
      'ui:placeholder': ' ',
      'bsClassNames': 'col-sm-6 field-friends-email'
    },
    field_message: {
      'ui:placeholder': ' ',
      'ui:widget': 'textarea',
      'bsClassNames': 'col-sm-12'
    },
    sending_date: {
      'bsClassNames': 'col-sm-12 send-date',
      'ui:widget': 'hidden'
    }
  };

  shouldComponentUpdate(nextProps) {
    if (nextProps.expanded !== this.props.expanded) {
      return true;
    }
    if (nextProps.clicksCounter !== this.props.clicksCounter) {
      return true;
    }

    return false;
  }

  componentWillReceiveProps(nextProps) {
    // The form was closed - disable errors.
    if (!nextProps.expanded) {
      this.setState({ showErrors: false });
      return;
    }

    // True if a user initiated validation by clicking "Continue Checkout".
    const newSubmitClickOccurred = nextProps.clicksCounter > this.props.clicksCounter;
    // True if the form was already expanded.
    const isExanded = this.props.expanded && nextProps.expanded;
    if (isExanded && newSubmitClickOccurred) {
      this.setState({ showErrors: true });
    }
  }

  render() {
    const { card, expanded } = this.props;

    const uiSchema = {
      // Add a unique prefix to form fields to avoid conflicts between multiple
      // instanses of the same form.
      'ui:rootFieldId': card.cardIndex.substring(card.cardIndex.length - 10),
      ...this.uiSchema
    };
    return (
      <Row className={classNames('email-card-form', { 'showErrors': this.state.showErrors })}>
        <Col xs={12}>
          <Panel expanded={expanded} onToggle={() => { }}>
            <Panel.Collapse>
              <Panel.Body>
                <CheckoutFormContainer
                  schema={this.schema}
                  uiSchema={uiSchema}
                  formClass="ecard"
                  formData={card.emailFormData}
                  {...this.props}
                />
              </Panel.Body>
            </Panel.Collapse>
          </Panel>
        </Col>
      </Row>
    );
  }
}

EmailCardForm.propTypes = {
  card: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired,
  clicksCounter: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  // The component will receive a new value of clicksCounter prop each time
  // a user clicks on "Continue Checkout" button.
  clicksCounter: state.checkout.showErrorsCounter,
});

export default connect(mapStateToProps)(EmailCardForm);
