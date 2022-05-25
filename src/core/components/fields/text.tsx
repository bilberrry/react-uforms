import React, { PropsWithoutRef, useEffect } from 'react';
import { useField } from '../../hooks';
import { stringToValue, valueToString } from '../../helpers';
import { FieldPassedProps, FieldRefProp, FormValues } from '../../types';
import { FieldErrors } from '../extra/field-errors';

export interface TextProps extends Omit<React.HTMLProps<HTMLInputElement>, 'value'> {
  emptyValue?: string | null;
  validateOnChange?: boolean;
  validateDelay?: number;
  onStopTyping?: () => {};
  stopTypingDelay?: number;
}

const TextComponent = <Values extends FormValues>({
  name,
  disabled,
  onBlur,
  onChange,
  emptyValue = '',
  className,
  hideError,
  dependsOn,
  validateOnChange,
  validateDelay,
  onStopTyping,
  stopTypingDelay,
  uRef,
  ...props
}: PropsWithoutRef<TextProps & FieldPassedProps<Values> & FieldRefProp<HTMLInputElement>>) => {
  const [value, setValue, { getInputClassName, validate, setTouched }] = useField<Values>(name, {
    disabled,
    dependsOn,
  });
  useEffect(() => {
    if (validateOnChange) {
      const timeOutId = setTimeout(() => validate(), validateDelay || 500);
      return () => clearTimeout(timeOutId);
    }
  }, [value, validateOnChange]);
  useEffect(() => {
    if (onStopTyping) {
      const timeOutId = setTimeout(() => onStopTyping(), stopTypingDelay || 500);
      return () => clearTimeout(timeOutId);
    }
  }, [value, onStopTyping]);

  return (
    <>
      <input
        {...props}
        ref={uRef}
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
          validate();
          if (onBlur) {
            onBlur(event);
          }
        }}
      />
      {!hideError && <FieldErrors name={name} />}
    </>
  );
};

TextComponent.displayName = 'Text';

export const Text = TextComponent;
