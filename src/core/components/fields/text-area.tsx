import React, { useEffect } from 'react';
import { useField } from '../../hooks';
import { stringToValue, valueToString } from '../../helpers';
import { FieldPassedProps } from '../../types';
import { FieldErrors } from '../extra/field-errors';

export interface TextAreaProps extends Omit<React.HTMLProps<HTMLTextAreaElement>, 'value'> {
  emptyValue?: string | null;
  validateOnChange?: boolean;
  validateDelay?: number;
}

const TextAreaComponent = React.forwardRef<HTMLTextAreaElement, TextAreaProps & FieldPassedProps>(
  (
    {
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
      ...props
    },
    ref,
  ) => {
    const [value, setValue, { getInputClassName, validate, setTouched }] = useField(name, {
      disabled,
      dependsOn,
    });
    if (validateOnChange) {
      useEffect(() => {
        const timeOutId = setTimeout(() => validate(), validateDelay || 500);
        return () => clearTimeout(timeOutId);
      }, [value]);
    }
    return (
      <>
        <textarea
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
            validate();
            if (onBlur) {
              onBlur(event);
            }
          }}
        />
        {!hideError && <FieldErrors name={name} />}
      </>
    );
  },
);

TextAreaComponent.displayName = 'TextArea';

export const TextArea = TextAreaComponent;
