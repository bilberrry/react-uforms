import React, { ChangeEvent, createContext, PropsWithoutRef, ReactNode } from 'react';
import { FieldPassedProps, FieldValueType, FormValues } from '../../types';
import { jsonToValue } from '../../helpers';
import { useField } from '../../hooks';
import { FieldErrors } from '../extra/field-errors';

// TODO refactor RadioGroup - delete React createContext

export interface RadioGroupApi {
  name: string;
  value: FieldValueType;
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
}

export interface RadioGroupProps {
  onChange?: (event: ChangeEvent) => void;
  children: ReactNode;
}

export const ContextRadioGroup = createContext<RadioGroupApi | undefined>(undefined);

const RadioGroupComponent = <Values extends FormValues>({
  name,
  children,
  disabled,
  hideError,
  onChange,
  dependsOn,
}: PropsWithoutRef<RadioGroupProps & FieldPassedProps<Values>>) => {
  const [value, setValue, { validate, setTouched }] = useField<Values>(name, {
    disabled,
    dependsOn,
  });
  const childApi: RadioGroupApi = {
    name,
    value,
    disabled: !!disabled,
    onChange: (event) => {
      event.persist();
      const rawValue = event.currentTarget.getAttribute('value');
      const value = rawValue ? jsonToValue(rawValue) : null;
      setValue(value);
      validate();
      setTouched(); // TODO check
      if (onChange) {
        onChange(event);
      }
    },
  };

  return (
    <>
      <ContextRadioGroup.Provider value={childApi}>{children}</ContextRadioGroup.Provider>
      {!hideError && <FieldErrors name={name} />}
    </>
  );
};

RadioGroupComponent.displayName = 'RadioGroup';

export const RadioGroup = RadioGroupComponent;
