import React from 'react';
import { useField } from '../../hooks';
import { stringToValue, valueToString } from '../../helpers';
import { FieldPassedProps } from '../../types';
import { FieldErrors } from '../extra/field-errors';

export interface TextAreaProps extends Omit<React.HTMLProps<HTMLTextAreaElement>, 'value'> {
  emptyValue?: string | null;
}

const TextAreaComponent = React.forwardRef<HTMLTextAreaElement, TextAreaProps & FieldPassedProps>(
  ({ name, disabled, onBlur, onChange, emptyValue = '', className, hideError, dependsOn, ...props }, ref) => {
    const [value, setValue, { getInputClassName, validate, setTouched }] = useField(name, {
      disabled,
      dependsOn,
    });
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
