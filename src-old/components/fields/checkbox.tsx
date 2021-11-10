import React from 'react';
import { Field, FieldPassedProps } from '../field';

export interface CheckboxProps extends Omit<React.HTMLProps<HTMLInputElement>, 'value'> {
  onValue: string | number | boolean | null | {};
  offValue: string | number | boolean | null | {};
}

const CheckboxComponent: React.FC<CheckboxProps & FieldPassedProps> = ({
  getValue,
  getErrors,
  setValue,
  setTouched,
  onBlur,
  onChange,
  onValue,
  offValue,
  ...props
}) => (
  <input
    {...props}
    checked={onValue === getValue()}
    type="checkbox"
    onChange={(event) => {
      event.persist();
      setValue(event.target.checked ? onValue : offValue, () => {
        if (onChange) {
          onChange(event);
        }
      });
    }}
    onBlur={(event) => {
      event.persist();
      setTouched(() => {
        if (onBlur) {
          onBlur(event);
        }
      });
    }}
  />
);

CheckboxComponent.displayName = 'Checkbox';

export const Checkbox = Field(CheckboxComponent, { hideError: true });
