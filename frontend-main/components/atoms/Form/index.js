import React from 'react';
import Form from 'react-jsonschema-form';

class DefaultForm extends React.Component {

  handleChange(data) {
    this.props.onChange(data);
  }
  handleSubmit(data) {
    this.props.onSubmit(data);
  }

  handleError(data) {
    this.props.onError(data);
  }

  render() {
    const { schema, uiSchema, children, className, autocomplete, widgets, fields } = this.props;
    return (
      <Form
        className={`form ${className}`}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={this.handleSubmit.bind(this)}
        onChange={this.handleChange.bind(this)}
        onError={this.handleError.bind(this)}
        formData={this.props.formData}
        showErrorList={false}
        autocomplete={autocomplete}
        widgets={widgets}
        fields={fields}
      >
        {/*{children}*/}
      </Form>
    );
  }
}

DefaultForm.defaultProps = {
  schema: {},
  uiSchema: {},
  formData: {},
  onSubmit: () => {},
  onChange: () => {},
  onError: () => {},
  children: {},
  widgets: {},
  fields: {},
  className: '',
  autocomplete: 'on',
};

export default DefaultForm;
