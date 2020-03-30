import React from 'react';
import { Field, FieldPassedProps } from '../field';
import { valueToString } from '../helpers';

export interface TextAreaProps extends Omit<React.HTMLProps<HTMLTextAreaElement>, 'value'> {
  emptyValue?: string | null;
}

const TextAreaComponent: React.FC<TextAreaProps & FieldPassedProps> = ({
  getValue,
  getErrors,
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

TextAreaComponent.displayName = 'TextArea';

export const TextArea = Field(TextAreaComponent);
