import React from 'react';
import Field, { FieldPassedProps } from '../field';

export interface CheckboxProps {
  onValue: string | number | boolean | null | {};
  offValue: string | number | boolean | null | {};
  onChange?: (event: React.ChangeEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  [key: string]: any;
}

const Checkbox: React.FC<CheckboxProps & FieldPassedProps> = ({
  getValue,
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
    onChange={event => {
      event.persist();
      setValue(event.target.checked ? onValue : offValue, () => {
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
  />
);

export default Field(Checkbox, { hideError: true });
