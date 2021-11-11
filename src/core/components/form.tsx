import React from 'react';
import { FormProps, FormProvider } from './form-provider';
import { FormStoreProvider, createFormStore } from '../api';

const FormComponent: React.FC<FormProps<unknown>> = ({ children, ...props }) => {
  return (
    <FormStoreProvider createStore={createFormStore}>
      <FormProvider {...props}>{children}</FormProvider>
    </FormStoreProvider>
  );
};

FormComponent.displayName = 'Form';
export const Form = FormComponent;
