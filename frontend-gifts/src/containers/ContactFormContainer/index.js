import React from 'react';
import { connect } from 'react-redux';
import Form from 'react-jsonschema-form';
import * as contactActions from '../../actions/contact';

const schema = {
  type: 'object',
  required: ['name', 'email', 'message'],
  properties: {
    name: { type: 'string', title: 'Your name' },
    email: { type: 'string', format: 'email', title: 'Email address' },
    message: { type: 'string', title: 'Your message' }
  }
};

const uiSchema = {
  'name': {
    'ui:placeholder': 'Name',
  },
  'email': {
    'ui:placeholder': 'E-mail',
  },
  'message': {
    'ui:placeholder': 'Message',
    'ui:widget': 'textarea',
  },
};

class ContactFormContainer extends React.Component {

  handleSubmit = ({ formData }) => {
    this.props.dispatch(
      contactActions.postForm(formData)
    );
  };

  render = () => {
    const { contactForm } = this.props;

    let submitButton;
    if (contactForm.isPending) {
      submitButton = <button type="submit" className="btn btn-primary btn-block waves-effect waves-light space-top-none" disabled="disabled">Sending...</button>;
    }
    else {
      submitButton = <button type="submit" className="btn btn-primary btn-block waves-effect waves-light space-top-none">Send</button>;
    }

    return (
      <div>
        { contactForm.isFulfilled &&
        <div className="status-message success space-bottom-2x">The message has been successfully sent.</div>
        }
        { contactForm.errorMessage &&
        <div className="status-message error space-bottom-2x" dangerouslySetInnerHTML={{ __html: contactForm.errorMessage }} />
        }
        <Form
          id="contact"
          schema={schema}
          uiSchema={uiSchema}
          formData={contactForm.formData}
          onSubmit={this.handleSubmit}
        >
          {submitButton}
        </Form>
      </div>
    );
  };
}

ContactFormContainer.propTypes = {
  dispatch: React.PropTypes.func,
  contactForm: React.PropTypes.shape({
    isPending: React.PropTypes.bool,
    isFulfilled: React.PropTypes.bool,
    formData: React.PropTypes.object,
    errorMessage: React.PropTypes.string
  }),
};

const mapStoreToProps = store => ({
  contactForm: store.contactForm,
});

export default connect(mapStoreToProps)(ContactFormContainer);
