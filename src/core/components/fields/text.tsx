import React from 'react';
import { useField } from '../../hooks';
import { stringToValue, valueToString } from '../../helpers';
import { FieldPassedProps } from '../../types';

export interface TextProps extends Omit<React.HTMLProps<HTMLInputElement>, 'value'> {
  emptyValue?: string | null;
}

const TextComponent = React.forwardRef<HTMLInputElement, TextProps & FieldPassedProps>(
  ({ name, disabled, onBlur, onChange, emptyValue = '', className, validators, ...props }, ref) => {
    const [value, setValue, { getInputClassName, setTouched }] = useField(name, {
      disabled,
      validators,
    });
    return (
      <input
        {...props}
        ref={ref}
        value={valueToString(value, emptyValue)}
        disabled={disabled}
        className={getInputClassName(className)}
        onChange={(event) => {
          event.persist();
          setValue(stringToValue(event.target.value, emptyValue));
          if (onChange) {
            onChange(event);
          }
        }}
        onBlur={(event) => {
          event.persist();
          setTouched();
          if (onBlur) {
            onBlur(event);
          }
        }}
      />
    );
  },
);

TextComponent.displayName = 'Text';

export const Text = TextComponent;
