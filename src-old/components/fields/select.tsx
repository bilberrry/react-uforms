import React from 'react';
import { Field, FieldPassedProps } from '../field';
import { valueToJson, jsonToValue } from '../helpers';

export interface OptionProps extends Omit<React.HTMLProps<HTMLOptionElement>, 'value'> {
  name: string;
  value: string | number | boolean | {} | null;
  [key: string]: any; // TODO HTMLProps bug?
}

export interface SelectProps extends React.HTMLProps<HTMLSelectElement> {
  options: OptionProps[];
}

const SelectComponent: React.FC<SelectProps & FieldPassedProps> = ({
  getValue,
  getErrors,
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

SelectComponent.displayName = 'Select';

export const Select = Field(SelectComponent);
