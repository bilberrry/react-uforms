import React from 'react';
import Field, { FieldPassedProps } from '../field';
import { valueToJson, jsonToValue } from '../helpers';

export interface OptionProps {
  name: string;
  value?: string | number | boolean | {} | null;
  disabled?: boolean;
  [key: string]: any;
}

export interface SelectProps {
  onChange?: (event: React.ChangeEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  options: OptionProps[];
}

const Select: React.FC<SelectProps & FieldPassedProps> = ({
  getValue,
  setValue,
  setTouched,
  options,
  onBlur,
  onChange,
  ...props
}) => (
  <select
    {...props}
    value={valueToJson(getValue())}
    onChange={event => {
      event.persist();
      const { target } = event;
      const isNull = !target.options[target.selectedIndex].hasAttribute('value');
      setValue(isNull ? null : jsonToValue(target.value), () => {
        if (onChange) {
          onChange(event);
        }
      });
    }}
    onBlur={event => {
      event.persist();
      setTouched(() => {
        if (onBlur) {
          onBlur(event);
        }
      });
    }}
  >
    {options.map(({ name, value, ...rest }) => {
      const jsonValue = valueToJson(value);
      return (
        <option {...rest} key={jsonValue} value={jsonValue}>
          {name}
        </option>
      );
    })}
  </select>
);

export default Field(Select);
