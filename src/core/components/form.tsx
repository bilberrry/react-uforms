import React, { PropsWithRef, ReactElement } from 'react';
import { FormProps, FormProvider } from './form-provider';
import { createFormStore, FormStoreProvider } from '../store';
import { FormValues } from '../types';

const FormComponent = <Values extends FormValues>({
  children,
  ...props
}: PropsWithRef<FormProps<Values>>): ReactElement | null => {
  return (
    <FormStoreProvider createStore={createFormStore}>
      <FormProvider {...props}>{children}</FormProvider>
    </FormStoreProvider>
  );
};

FormComponent.displayName = 'Form';
export const Form = FormComponent;
