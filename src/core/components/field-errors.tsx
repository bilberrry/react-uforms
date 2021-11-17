import React from 'react';
import { useFieldErrors } from '../hooks';

export interface FieldErrorsProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
}

const FieldErrorsComponent = React.forwardRef<HTMLDivElement, FieldErrorsProps>(({ name, ...rest }, ref) => {
  const [errors, className] = useFieldErrors(name);
  return errors && errors.length > 0 ? (
    <div {...rest} ref={ref} className={className}>
      {errors.join(' ')}
    </div>
  ) : null;
});

FieldErrorsComponent.displayName = 'FieldErrors';

export const FieldErrors = FieldErrorsComponent;
