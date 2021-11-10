import React, { ChangeEvent, ReactNode } from 'react';
import { ContextCheckboxGroup } from '../form-context';
import { Field, FieldPassedProps } from '../field';
import { jsonToValue } from '../helpers';
import { ValueType } from '../validator';

export interface CheckboxGroupProps {
  onChange?: (event: ChangeEvent) => void;
  children: ReactNode;
}

export interface CheckboxGroupApi {
  name: string;
  getValue: () => ValueType;
  setTouched: (callback?: () => void) => void;
  onChange: (event: ChangeEvent) => void;
}

const CheckboxGroupComponent: React.FC<CheckboxGroupProps & FieldPassedProps> = ({
  name,
  children,
  getValue,
  getErrors,
  setValue,
  setTouched,
  onChange,
}) => {
  const childApi: CheckboxGroupApi = {
    name,
    getValue,
    setTouched,
    onChange: event => {
      event.persist();
      const rawValue = event.currentTarget.getAttribute('value');
      const value = rawValue ? jsonToValue(rawValue) : null;
      const checked = getValue() || [];
      setValue(
        checked.length > 0 && checked.includes(value)
          ? checked.filter((item: string) => item !== value)
          : [...checked, value],
        () => {
          if (onChange) {
            onChange(event);
          }
        },
      );
    },
  };

  return <ContextCheckboxGroup.Provider value={childApi}>{children}</ContextCheckboxGroup.Provider>;
};

CheckboxGroupComponent.displayName = 'CheckboxGroup';

export const CheckboxGroup = Field(CheckboxGroupComponent);
