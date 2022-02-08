import React, { PropsWithoutRef } from 'react';
import { useField } from '../../hooks';
import { FieldPassedProps, FieldRefProp, FieldValueType, FormValues } from '../../types';

export interface CheckboxProps extends Omit<React.HTMLProps<HTMLInputElement>, 'value'> {
  onValue: FieldValueType;
  offValue: FieldValueType;
}

const CheckboxComponent = <Values extends FormValues>({
  name,
  disabled,
  onBlur,
  onChange,
  className,
  onValue,
  offValue,
  dependsOn,
  uRef,
  ...props
}: PropsWithoutRef<CheckboxProps & FieldPassedProps<Values> & FieldRefProp<HTMLInputElement>>) => {
  const [value, setValue, { getInputClassName, validate, setTouched }] = useField<Values>(name, {
    disabled,
    dependsOn,
  });
  return (
    <input
      {...props}
      type="checkbox"
      ref={uRef}
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
};

CheckboxComponent.displayName = 'Checkbox';

export const Checkbox = CheckboxComponent;
