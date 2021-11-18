import React, { ChangeEvent, createContext, ReactNode } from 'react';
import { FieldPassedProps, FieldValueType } from '../../types';
import { jsonToValue } from '../../helpers';
import { useField } from '../../hooks';
import { FieldErrors } from '../field-errors';

// TODO refactor CheckboxGroup - delete React createContext

export interface CheckboxGroupApi {
  name: string;
  value: FieldValueType;
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
}

export interface CheckboxGroupProps {
  onChange?: (event: ChangeEvent) => void;
  children: ReactNode;
}

export const ContextCheckboxGroup = createContext<CheckboxGroupApi | undefined>(undefined);

const CheckboxGroupComponent: React.FC<CheckboxGroupProps & FieldPassedProps> = ({
  name,
  children,
  disabled,
  hideError,
  validators,
  onChange,
}) => {
  const [value, setValue, { validate, setTouched }] = useField(name, {
    disabled,
    validators,
  });
  const childApi: CheckboxGroupApi = {
    name,
    value,
    disabled: !!disabled,
    onChange: (event) => {
      event.persist();
      const rawValue = event.currentTarget.getAttribute('value');
      const inputValue = rawValue ? jsonToValue(rawValue) : null;
      const stateValue = value || [];
      const arrValue =
        stateValue.length > 0 && stateValue.includes(inputValue)
          ? stateValue.filter((item: string) => item !== inputValue)
          : [...stateValue, inputValue];
      setValue(arrValue);
      validate();
      setTouched(); // TODO check
      if (onChange) {
        onChange(event);
      }
    },
  };

  return (
    <>
      <ContextCheckboxGroup.Provider value={childApi}>{children}</ContextCheckboxGroup.Provider>
      {!hideError && <FieldErrors name={name} />}
    </>
  );
};

CheckboxGroupComponent.displayName = 'CheckboxGroup';

export const CheckboxGroup = CheckboxGroupComponent;
