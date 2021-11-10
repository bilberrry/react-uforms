import React from 'react';
import { Field, FieldPassedProps } from '../field';
import { valueToString } from '../helpers';

export interface TextProps extends Omit<React.HTMLProps<HTMLInputElement>, 'value'> {
  emptyValue?: string | null;
}

const TextComponent: React.FC<TextProps & FieldPassedProps> = ({
  getValue,
  getErrors,
  setValue,
  setTouched,
  onBlur,
  onChange,
  emptyValue = '',
  ...props
}) => (
  <input
    {...props}
    value={valueToString(getValue())}
    onChange={event => {
      event.persist();
      const value = event.target.value === '' ? emptyValue : event.target.value;
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

TextComponent.displayName = 'Text';

export const Text = Field(TextComponent);
