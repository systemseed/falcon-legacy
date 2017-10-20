import React from 'react';

// Example of global widgets.
// See: https://github.com/mozilla-services/react-jsonschema-form#custom-widgets-and-fields
const widgets = {
  'uuid': props => (
    <input
      type="text"
      className="custom"
      value={props.value}
      required={props.required}
      onChange={event => props.onChange(event.target.value)}
    />
  ),
  'utc-millisec': props => (
    <div>{props.value}</div>
  )
};

export default widgets;
