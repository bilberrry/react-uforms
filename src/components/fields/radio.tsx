import React from 'react';
import { Field, FieldPassedProps } from '../field';
import { valueToJson } from '../helpers';

export interface RadioProps {
  value: string | number | boolean | {} | null;
  onChange?: (event: React.ChangeEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  [key: string]: any;
}

const RadioComponent: React.FC<RadioProps & FieldPassedProps> = ({
  getValue,
  setValue,
  setTouched,
  onBlur,
  onChange,
  value,
  ...props
}) => (
  <input
    {...props}
    value={valueToJson(getValue())}
    checked={value === getValue()}
    type="radio"
    onChange={event => {
      event.persist();
      setValue(value, () => {
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

RadioComponent.displayName = 'Radio';

export const Radio = Field(RadioComponent, { hideError: true });
