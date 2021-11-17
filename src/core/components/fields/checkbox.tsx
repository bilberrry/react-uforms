import React from 'react';
import { useField } from '../../hooks';
import { FieldPassedProps } from '../../types';

export interface CheckboxProps extends Omit<React.HTMLProps<HTMLInputElement>, 'value'> {
  onValue: string | number | boolean | null | Record<string, unknown>;
  offValue: string | number | boolean | null | Record<string, unknown>;
}

const CheckboxComponent = React.forwardRef<HTMLInputElement, CheckboxProps & FieldPassedProps>(
  ({ name, disabled, onBlur, onChange, className, validators, onValue, offValue, ...props }, ref) => {
    const [value, setValue, { getInputClassName, validate, setTouched }] = useField(name, {
      disabled,
      validators,
    });
    return (
      <input
        {...props}
        type="checkbox"
        ref={ref}
        checked={value === onValue}
        disabled={disabled}
        className={getInputClassName(className)}
        onChange={(event) => {
          event.persist();
          setValue(event.target.checked ? onValue : offValue);
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

CheckboxComponent.displayName = 'Checkbox';

export const Checkbox = CheckboxComponent;
