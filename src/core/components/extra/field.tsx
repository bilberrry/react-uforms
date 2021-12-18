import React, { ReactNode } from 'react';
import { useField } from '../../hooks';
import { FieldApiInterface, FieldPassedProps, FormApiInterface } from '../../types';
import { FieldErrors } from './field-errors';

type FieldApiChildren = (fieldApi: FieldApiInterface, formAPi: FormApiInterface<unknown>) => ReactNode;

export interface FieldProps {
  children: FieldApiChildren;
}

const FieldComponent: React.FC<FieldProps & FieldPassedProps> = ({
  name,
  disabled,
  hideError,
  children,
  dependsOn,
}) => {
  const [, , fieldApi, formApi] = useField(name, {
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