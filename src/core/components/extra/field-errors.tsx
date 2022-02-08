import React, { PropsWithoutRef } from 'react';
import { useFieldErrors } from '../../hooks';
import { FieldRefProp, FormValues, NestedKeys } from '../../types';

export interface FieldErrorsProps<Values extends FormValues> extends React.HTMLProps<HTMLUListElement> {
  name: NestedKeys<Values>;
}

const FieldErrorsComponent = <Values extends FormValues>({
  name,
  uRef,
  ...rest
}: PropsWithoutRef<FieldErrorsProps<Values> & FieldRefProp<HTMLUListElement>>) => {
  const [errors, className] = useFieldErrors<Values>(name);
  return errors && errors.length > 0 ? (
    <ul {...rest} ref={uRef} className={className}>
      {errors.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  ) : null;
};

FieldErrorsComponent.displayName = 'FieldErrors';

export const FieldErrors = FieldErrorsComponent;
