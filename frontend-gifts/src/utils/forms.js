import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import InfoIcon from '../components/InfoIcon';

// Custom JSON Schema field template for checkout form. See:
// 1. https://github.com/mozilla-services/react-jsonschema-form#field-template
// 2. https://github.com/tonystar/bootstrap-float-label
export const FieldTemplateCheckout = (props) => {
  const { id, classNames, label, help, required, description, children, schema, uiSchema } = props; // eslint-disable-line react/prop-types

  // Add extra classes.
  let extraClassNames = '';

  if (schema.type === 'string' || schema.type === 'number') {
    extraClassNames = uiSchema.bsClassNames ? uiSchema.bsClassNames : 'col-sm-6';
    extraClassNames += ' has-float-label';
  }

  let tooltip = '';
  if (uiSchema['ui:tooltip']) {
    tooltip = (
      <Tooltip id="tooltip">
        {uiSchema['ui:tooltip']}
      </Tooltip>
    );
  }

  return (
    <div className={`${classNames} ${extraClassNames}`}>
      {children}
      {schema.type !== 'boolean' &&
        <label htmlFor={id}>{label}{required ? '*' : null}</label>
      }
      {tooltip &&
      <OverlayTrigger placement="bottom" overlay={tooltip}>
        <div className="info-icon-wrapper bottom">
          <InfoIcon />
        </div>
      </OverlayTrigger>}
      {tooltip &&
      <OverlayTrigger placement="left" overlay={tooltip}>
        <div className="info-icon-wrapper left">
          <InfoIcon />
        </div>
      </OverlayTrigger>}
      {description}
      {help}
    </div>
  );
};
