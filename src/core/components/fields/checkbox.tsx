import React from 'react';
import { useField } from '../../hooks';
import { FieldPassedProps, FieldValueType } from '../../types';

export interface CheckboxProps extends Omit<React.HTMLProps<HTMLInputElement>, 'value'> {
  onValue: FieldValueType;
  offValue: FieldValueType;
}

const CheckboxComponent = React.forwardRef<HTMLInputElement, CheckboxProps & FieldPassedProps>(
  ({ name, disabled, onBlur, onChange, className, onValue, offValue, dependsOn, ...props }, ref) => {
    const [value, setValue, { getInputClassName, validate, setTouched }] = useField(name, {
      disabled,
      dependsOn,
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
