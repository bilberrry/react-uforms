import React, { PropsWithoutRef, ReactElement, ReactNode } from 'react';
import { useField } from '../../hooks';
import { FieldApiInterface, FieldPassedProps, FormApiInterface, FormValues } from '../../types';
import { FieldErrors } from './field-errors';

type FieldApiChildren<Values extends FormValues> = (
  fieldApi: FieldApiInterface,
  formAPi: FormApiInterface<Values>,
) => ReactNode;

export interface FieldProps<Values extends FormValues> {
  children: FieldApiChildren<Values>;
}

const FieldComponent = <Values extends FormValues>({
  name,
  disabled,
  hideError,
  children,
  dependsOn,
}: PropsWithoutRef<FieldProps<Values> & FieldPassedProps<Values>>): ReactElement | null => {
  const [, , fieldApi, formApi] = useField<Values>(name, {
    disabled,
    dependsOn,
  });
  return (
    <>
      {children(fieldApi, formApi)}
      {!hideError && <FieldErrors name={name} />}
    </>
  );
};

FieldComponent.displayName = 'Field';

export const Field = FieldComponent;
