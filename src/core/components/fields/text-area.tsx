import React, { PropsWithoutRef, useEffect } from 'react';
import { useField } from '../../hooks';
import { stringToValue, valueToString } from '../../helpers';
import { FieldPassedProps, FieldRefProp, FormValues } from '../../types';
import { FieldErrors } from '../extra/field-errors';

export interface TextAreaProps extends Omit<React.HTMLProps<HTMLTextAreaElement>, 'value'> {
  emptyValue?: string | null;
  validateOnChange?: boolean;
  validateDelay?: number;
  onStopTyping?: () => void;
  stopTypingDelay?: number;
}

const TextAreaComponent = <Values extends FormValues>({
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
}: PropsWithoutRef<TextAreaProps & FieldPassedProps<Values> & FieldRefProp<HTMLTextAreaElement>>) => {
  const [value, setValue, { getInputClassName, validate, setTouched }] = useField(name, {
    disabled,
    dependsOn,
  });
  useEffect(() => {
    if (validateOnChange) {
      const timeOutId = setTimeout(() => validate(), validateDelay || 500);
      return () => clearTimeout(timeOutId);
    }
  }, [value]);
  useEffect(() => {
    if (onStopTyping) {
      const timeOutId = setTimeout(() => onStopTyping(), stopTypingDelay || 500);
      return () => clearTimeout(timeOutId);
    }
  }, [value]);

  return (
    <>
      <textarea
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

TextAreaComponent.displayName = 'TextArea';

export const TextArea = TextAreaComponent;
