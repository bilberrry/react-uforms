import React from 'react';
import { useField } from '../../hooks';
import { valueToJson } from '../../helpers';
import { FieldPassedProps } from '../../types';

export interface RadioProps extends Omit<React.HTMLProps<HTMLInputElement>, 'value'> {
  value: string | number | boolean | Record<string, unknown> | null;
}

const RadioComponent = React.forwardRef<HTMLInputElement, RadioProps & FieldPassedProps>(
  ({ name, disabled, onBlur, onChange, className, validators, value: inputValue, ...props }, ref) => {
    const [value, setValue, { getInputClassName, validate, setTouched }] = useField(name, {
      disabled,
      validators,
    });
    return (
      <input
        {...props}
        type="radio"
        ref={ref}
        value={valueToJson(value)}
        checked={inputValue === value}
        disabled={disabled}
        className={getInputClassName(className)}
        onChange={(event) => {
          event.persist();
          setValue(inputValue);
          if (onChange) {
            onChange(event);
          }
        }}
        onBlur={(event) => {
          event.persist();
          setTouched();
          validate();
          if (onBlur) {
            onBlur(event);
          }
        }}
      />
    );
  },
);

RadioComponent.displayName = 'Radio';

export const Radio = RadioComponent;
