import React from 'react';
import AltDateWidgetOriginal from 'react-jsonschema-form/lib/components/widgets/AltDateWidget';
import { pad } from 'react-jsonschema-form/lib/utils';

// We override original AltDataWidget to add required attribut to the date selectboxes.
class AltDateWidget extends AltDateWidgetOriginal {
  render() {
    const { id, disabled, readonly, autofocus, required, registry, onBlur } = this.props;
    return (
      <ul className="list-inline">
        {this.dateElementProps.map((elemProps, i) => (
          <li key={i}>
            <DateElement
              rootId={id}
              select={this.onChange}
              {...elemProps}
              disabled={disabled}
              readonly={readonly}
              required={required}
              registry={registry}
              onBlur={onBlur}
              autofocus={autofocus && i === 0}
            />
          </li>
        ))}
        <li>
          <a href="#" className="btn btn-info btn-now" onClick={this.setNow}>
            Now
          </a>
        </li>
        <li>
          <a
            href="#"
            className="btn btn-warning btn-clear"
            onClick={this.clear}>
            Clear
          </a>
        </li>
      </ul>
    );
  }
}

function rangeOptions(start, stop) {
  let options = [];
  for (let i = start; i <= stop; i++) {
    options.push({ value: i, label: pad(i, 2) });
  }
  return options;
}

function DateElement(props) {
  const {
    type,
    range,
    value,
    select,
    rootId,
    disabled,
    readonly,
    required,
    autofocus,
    registry,
    onBlur,
  } = props;
  const id = rootId + "_" + type;
  const { SelectWidget } = registry.widgets;
  return (
    <SelectWidget
      schema={{ type: "integer" }}
      id={id}
      className="form-control"
      options={{ enumOptions: rangeOptions(range[0], range[1]) }}
      placeholder={type}
      value={value}
      disabled={disabled}
      required={required}
      readonly={readonly}
      autofocus={autofocus}
      onChange={value => select(type, value)}
      onBlur={onBlur}
    />
  );
}

export default AltDateWidget;