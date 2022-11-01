import React, { PropsWithoutRef } from 'react';
import { useField } from '../../hooks';
import { valueToJson } from '../../helpers';
import { FieldPassedProps, FieldRefProp, FieldValueType, FormValues } from '../../types';

export interface RadioProps extends Omit<React.HTMLProps<HTMLInputElement>, 'value'> {
  value: FieldValueType;
}

const RadioComponent = <Values extends FormValues>({
  name,
  disabled,
  onBlur,
  onChange,
  className,
  value: inputValue,
  dependsOn,
  uRef,
  ...props
}: PropsWithoutRef<RadioProps & Omit<FieldPassedProps<Values>, 'hideError'> & FieldRefProp<HTMLInputElement>>) => {
  const [value, setValue, { getInputClassName, validate, setTouched }] = useField(name, {
    disabled,
    dependsOn,
  });
  return (
    <input
      {...props}
      name={name}
      type="radio"
      ref={uRef}
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
};

RadioComponent.displayName = 'Radio';

export const Radio = RadioComponent;
