import React, { PropTypes, Component } from 'react';
import SchemaForm from 'react-jsonschema-form';
import widgetsConf from './widgets';
import globalUiSchema from './globalUiSchema';

/**
 * Form component.
 *
 * This is a simple wrapper around the mozilla services schema form.
 * See: https://github.com/mozilla-services/react-jsonschema-form
 *
 * Required props:
 * schema:
 *    Prop should follow the http://json-schema.org/ standard.
 * onSubmit:
 *    Callback handler to submit the data
 *
 * Optional props:
 * uiSchema:
 *    Either override completely or use a named import of this component
 *    and import globalUiSchema and then extend the uiSchema and pass in as a prop.
 *    See: https://github.com/mozilla-services/react-jsonschema-form#the-uischema-object
 * widgets:
 *    If you need to define custom widgets then you can pass them in this prop.
 *    As with the uiSchema if you want to reuse the global ones then do a named import of
 *    widgetConf.
 *    See: https://github.com/mozilla-services/react-jsonschema-form#custom-widgets-and-fields
 */
class Form extends Component {
  state = {
    'schema': {}
  };

  /**
   * @private
   * Filter through schema and only return fields that are in the fields list.
   *
   * The dot notation expects parent.child, not parent.properties.child.
   * I.e.:
   *    Schema array: properties[body][properties][value]
   *    Dot notation in fields filter body.value
   *
   * @param fieldsList
   *    The filter fields array list.
   *    This supports dot notation for nested fields.
   * @param schema
   *    Original schema object.
   * @returns {{}}
   *    The filtered list.
   */
  filterFields = (fieldsList, schema) => {
    const filteredProperties = {};
    const filteredRequired = [];
    const fields = schema.properties;
    fieldsList.forEach((key) => {
      // Dot notation filtering.
      if (key.includes('.')) {
        const split = key.split('.');
        const topKey = split.shift();
        // Make sure we include the other keys in the nested field.
        filteredProperties[topKey] = {
          ...fields[topKey],
          ...this.filterFields([split.join('.')], fields[topKey])
        };
      }
      else {
        filteredProperties[key] = fields[key];
        if (schema.required) {
          if (schema.required.includes(key)) {
            filteredRequired.push(key);
          }
        }
      }
    });
    return {
      properties: filteredProperties,
      required: filteredRequired
    };
  };

  /**
   * @private
   *
   */
  injectValues = (newValues, schema) => {
    const filteredProperties = {};
    const fields = schema.properties;
    newValues.forEach((key) => {
      // Dot notation filtering.
      if (key.includes('.')) {
        const split = key.split('.');
        const topKey = split.shift();
        // Make sure we include the other keys in the nested field.
        filteredProperties[topKey] = {
          ...this.filterFields([split.join('.')], fields[topKey])
        };
      }
      else {
        // Array merge
        filteredProperties[key] = {
          ...fields[key],
          ...newValues[key]
        };
      }
    });
    return {
      properties: filteredProperties,
    };
  };

  // Filter in only fields we want.
  componentDidMount = () => {
    // Loop over our field filter so that we both can set the order and filter
    // out fields we don't want.
    const filtered = this.filterFields(this.props.fieldsFilter, this.props.schema);

    // Store in the state so that we are not mutating the props.
    // This also forces react to rerender this component.
    this.setState({
      'schema': {
        ...this.props.schema,
        ...filtered
      }
    });
  };

  /**
   * Render out.
   *
   * The schema is filtered in the componentWillMount hook.
   * Therefore we use the state value for schema but since the other valus
   * are not filtered we simply pass them straight through.
   *
   * Todo: Fix UiSchema for nested elements
   * @returns Component The schemaform component.
   */
  render = () => (
    <SchemaForm
      schema={this.state.schema}
      uiSchema={this.props.uiSchema}
      widgets={this.props.widgets}
      onSubmit={this.props.onSubmit}
      onChange={this.props.onChange}
      onError={this.props.onError}
    >
      {this.props.children}
    </SchemaForm>
  );
}

Form.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  widgets: PropTypes.object,
  fieldsFilter: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onError: PropTypes.func,
};

Form.defaultProps = {
  uiSchema: globalUiSchema,
  widgets: widgetsConf,
  fieldsFilter: [],
  onError: Form.onError
};


export default Form;
export { globalUiSchema, widgetsConf };
