import React, { Component, PropTypes } from 'react';
import { Row, Col, Panel } from 'react-bootstrap';
import CheckoutFormContainer from '../CheckoutFormContainer';

class EmailCardForm extends Component {
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

    return false;
  }

  render() {
    const { card } = this.props;

    const uiSchema = {
      // Add a unique prefix to form fields to avoid conflicts between multiple
      // instanses of the same form.
      'ui:rootFieldId': card.cardIndex.substring(0, 8),
      ...this.uiSchema
    };
    return (
      <Row className="email-card-form">
        <Col xs={12}>
          <Panel expanded={this.props.expanded} onToggle={() => { }}>
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
};

export default EmailCardForm;
