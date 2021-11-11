import React, { useEffect } from 'react';
import { useField } from '../../hooks';
import { jsonToValue, valueToJson } from '../../helpers';
import { FieldPassedProps } from '../../types';

// TODO test

export interface OptionProps extends Omit<React.HTMLProps<HTMLOptionElement>, 'value'> {
  name: string;
  value: string | number | boolean | Record<string, unknown> | null;
  // [key: string]: any; // TODO HTMLProps bug?
}

export interface SelectProps extends React.HTMLProps<HTMLSelectElement> {
  options: OptionProps[];
}

const SelectComponent = React.forwardRef<HTMLSelectElement, SelectProps & FieldPassedProps>(
  ({ name, disabled, onBlur, onChange, emptyValue = '', className, options, ...props }) => {
    const [value, setValue, { setDisabled, getInputClassName, setTouched }] = useField(name);
    useEffect(() => {
      setDisabled(!!disabled);
    }, [disabled]);
    return (
      <select
        {...props}
        value={valueToJson(value)}
        className={getInputClassName(className)}
        onChange={(event) => {
          event.persist();
          const { target } = event;
          const isNull = !target.options[target.selectedIndex].hasAttribute('value');
          setValue(isNull ? emptyValue || null : jsonToValue(target.value));
          if (onChange) {
            onChange(event);
          }
        }}
        onBlur={(event) => {
          event.persist();
          setTouched();
          if (onBlur) {
            onBlur(event);
          }
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
  },
);

SelectComponent.displayName = 'Select';

export const Text = SelectComponent;
