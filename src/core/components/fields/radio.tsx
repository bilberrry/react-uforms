import React from 'react';
import { useField } from '../../hooks';
import { valueToJson } from '../../helpers';
import { FieldPassedProps, FieldValueType } from '../../types';

export interface RadioProps extends Omit<React.HTMLProps<HTMLInputElement>, 'value'> {
  value: FieldValueType;
}

const RadioComponent = React.forwardRef<HTMLInputElement, RadioProps & FieldPassedProps>(
  ({ name, disabled, onBlur, onChange, className, value: inputValue, dependsOn, ...props }, ref) => {
    const [value, setValue, { getInputClassName, validate, setTouched }] = useField(name, {
      disabled,
      dependsOn,
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
