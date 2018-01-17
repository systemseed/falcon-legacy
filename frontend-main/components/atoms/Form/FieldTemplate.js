import React from 'react';

// Custom JSON Schema field template for checkout form. See:
// 1. https://github.com/mozilla-services/react-jsonschema-form#field-template
// 2. https://github.com/tonystar/bootstrap-float-label
export default props => {
  const { id, classNames, label, help, required, description, children, schema, uiSchema } = props;

  // Add extra classes.
  let extraClassNames = '';

  if (schema.type === 'string' || schema.type === 'number') {
    extraClassNames = uiSchema.bsClassNames ? uiSchema.bsClassNames : '';
    extraClassNames += ' has-float-label';
  }

  return (
    <div className={`${classNames} ${extraClassNames}`}>
      {children}
      {schema.type !== 'boolean' &&
      <label htmlFor={id}>{label}</label>
      }
      {description}
      {help}
    </div>
  );
}
