import React, { PropsWithoutRef } from 'react';
import { useField } from '../../hooks';
import { jsonToValue, valueToJson } from '../../helpers';
import { FieldPassedProps, FieldRefProp, FieldValueType, FormValues } from '../../types';
import { FieldErrors } from '../extra/field-errors';

// TODO test

export interface OptionProps extends Omit<React.HTMLProps<HTMLOptionElement>, 'value'> {
  name: string;
  value: FieldValueType;
  [key: string]: any; // TODO HTMLProps bug?
}

export interface SelectProps extends React.HTMLProps<HTMLSelectElement> {
  emptyValue?: string | null;
  options: (OptionProps & FieldRefProp<HTMLOptionElement>)[];
}

const SelectComponent = <Values extends FormValues>({
  name,
  disabled,
  onBlur,
  onChange,
  emptyValue = '',
  className,
  options,
  hideError,
  dependsOn,
  uRef,
  ...props
}: PropsWithoutRef<SelectProps & FieldPassedProps<Values> & FieldRefProp<HTMLSelectElement>>) => {
  const [value, setValue, { getInputClassName, setTouched, validate }] = useField(name, {
    disabled,
    dependsOn,
  });
  return (
    <>
      <select
        {...props}
        ref={uRef}
        value={valueToJson(value)}
        className={getInputClassName(className)}
        onChange={(event) => {
          event.persist();
          const { target } = event;
          const isNull = !target.options[target.selectedIndex].hasAttribute('value');
          setValue(isNull ? emptyValue || null : jsonToValue(target.value));
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
      >
        {options.map(({ name, value, uRef: oRef, ...rest }) => {
          const jsonValue = valueToJson(value);
          return (
            <option ref={oRef} {...rest} key={jsonValue} value={jsonValue}>
              {name}
            </option>
          );
        })}
      </select>
      {!hideError && <FieldErrors name={name} />}
    </>
  );
};

SelectComponent.displayName = 'Select';

export const Select = SelectComponent;
