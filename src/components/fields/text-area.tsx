import React from 'react';
import Field, { FieldPassedProps } from '../field';
import { valueToString } from '../helpers';

export interface TextAreaProps {
  emptyValue?: string | null;
  onChange?: (event: React.ChangeEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  [key: string]: any;
}

const TextArea: React.FC<TextAreaProps & FieldPassedProps> = ({
  getValue,
  setValue,
  setTouched,
  onBlur,
  onChange,
  emptyValue = '',
  ...props
}) => (
  <textarea
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

export default Field(TextArea);
