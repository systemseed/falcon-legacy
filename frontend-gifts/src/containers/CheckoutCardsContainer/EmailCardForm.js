import React, { Component, PropTypes } from 'react';
import { Row, Col, Panel } from 'react-bootstrap';
import Form from 'react-jsonschema-form';
import { FieldTemplateCheckout } from '../../utils/forms';

class EmailCardForm extends Component {
  schema = {
    title: '',
    type: 'object',
    required: ['field_friends_name', 'field_friends_email', 'field_message'],
    properties: {
      field_friends_name: {
        type: 'string', title: 'Friend’s name'
      },
      field_friends_email: {
        type: 'string', format: 'email', title: 'Friend’s email'
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
  }

  uiSchema = {
    field_friends_name: {
      'ui:placeholder': ' '
    },
    field_friends_email: {
      'ui:placeholder': ' '
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
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.expanded !== this.props.expanded) {
      return true;
    }

    return false;
  }

  onChange({ formData }) {
    const { card, onChangeEmailForm } = this.props;
    onChangeEmailForm(card.cardIndex, formData, false);
  }

  onValidate(formData, errors) {
    const { card, onChangeEmailForm } = this.props;
    onChangeEmailForm(card.cardIndex, formData, false);

    return errors;
  }

  onSubmit({ formData }) {
    const { card, onChangeEmailForm } = this.props;
    onChangeEmailForm(card.cardIndex, formData, true);
  }

  onPreviewClick(e) {
    e.preventDefault();
    this.props.onPreviewOpen(this.props.card.cardIndex);
  }

  render() {
    const { card } = this.props;
    return (
      <Row>
        <Col xs={12}>
          <Panel collapsible expanded={this.props.expanded}>
            <Form
              schema={this.schema}
              uiSchema={this.uiSchema}
              widgets={this.widgets}
              formData={card.emailFormData}
              onChange={this.onChange.bind(this)}
              onSubmit={this.onSubmit.bind(this)}
              validate={this.onValidate.bind(this)}
              FieldTemplate={FieldTemplateCheckout}
              className="card-send space-top space-bottom-2x"
            >
              <div className="primary-buttons">
                <button className="btn" onClick={this.onPreviewClick.bind(this)}>Preview</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </Form>
          </Panel>
        </Col>
      </Row>
    );
  }
}

EmailCardForm.propTypes = {
  card: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired,
  onChangeEmailForm: PropTypes.func.isRequired,
  onPreviewOpen: PropTypes.func.isRequired,
};

export default EmailCardForm;
