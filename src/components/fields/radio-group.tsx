import React, { ChangeEvent, ReactNode } from 'react';
import { ContextRadioGroup } from '../form-context';
import { Field, FieldPassedProps } from '../field';
import { jsonToValue } from '../helpers';
import { ValueType } from '../validator';

export interface RadioGroupProps {
  onChange?: (event: ChangeEvent) => void;
  children: ReactNode;
}

export interface RadioGroupApi {
  name: string;
  getValue: () => ValueType;
  setTouched: (callback?: () => void) => void;
  onChange: (event: ChangeEvent) => void;
}

const RadioGroupComponent: React.FC<RadioGroupProps & FieldPassedProps> = ({
  name,
  children,
  getValue,
  setValue,
  setTouched,
  onChange,
}) => {
  const childApi: RadioGroupApi = {
    name,
    getValue,
    setTouched,
    onChange: event => {
      event.persist();
      const rawValue = event.currentTarget.getAttribute('value');
      const value = rawValue ? jsonToValue(rawValue) : null;
      setValue(value, () => {
        if (onChange) {
          onChange(event);
        }
      });
    },
  };

  return <ContextRadioGroup.Provider value={childApi}>{children}</ContextRadioGroup.Provider>;
};

RadioGroupComponent.displayName = 'RadioGroup';

export const RadioGroup = Field(RadioGroupComponent);
