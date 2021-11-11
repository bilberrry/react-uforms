import React, { ReactElement, useEffect, useRef } from 'react';
import { useForm } from '../hooks';
import {
  ClassesInterface,
  FieldChangeEventInterface,
  FieldTouchEventInterface,
  FieldValueType,
  FormApiInterface,
  FormErrorsType,
  ValidationType,
} from '../types';
import isEqual from 'lodash.isequal';

export interface FormProps<Values>
  extends Omit<
    React.HTMLProps<HTMLFormElement & HTMLDivElement>,
    'onChange' | 'onSubmit' | 'onError' | 'defaultValues'
  > {
  children: ReactElement | ReactElement[] | any;
  onSubmit: (api: FormApiInterface<Values>, values: Values) => void;
  defaultValues?: Values;
  onChange?: (api: FormApiInterface<Values>, changedField: string, fieldValue: FieldValueType) => void;
  onTouch?: (api: FormApiInterface<Values>, touchedField: string) => void;
  onError?: (api: FormApiInterface<Values>, errors: FormErrorsType) => void;
  validation?: ValidationType | ((api: FormApiInterface<Values>) => ValidationType);
  classes?: Partial<ClassesInterface>;
}

export const defaultClasses: ClassesInterface = {
  field: {
    error: 'invalid-feedback',
    invalid: 'is-invalid',
  },
  fieldGroup: {
    active: 'active',
    errors: 'is-invalid',
    touched: 'is-touched',
    completed: 'is-completed',
  },
} as const;

const FormProviderComponent: React.FC<FormProps<unknown>> = ({
  children,
  defaultValues,
  onSubmit,
  onError,
  onChange,
  onTouch,
  validation,
  classes,
  ...props
}) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const api = useForm();
  useEffect(() => {
    api.setDefaultValues({ ...(defaultValues as object) });
    api.setValues({ ...(defaultValues as object) });
  }, []);
  useEffect(() => {
    api.setFormRef(formRef);
  }, [formRef]);
  useEffect(() => {
    const mergedClasses: ClassesInterface = {
      ...defaultClasses,
      ...(classes || {}),
    };
    api.setClasses(mergedClasses);
  }, [classes]);
  useEffect(() => {
    const items = validation && typeof validation === 'function' ? validation(api) : validation;
    api.setValidation(items || {});
  }, [validation]);
  useEffect(() => {
    formRef?.current?.addEventListener<any>('fieldChange', onChangeCallback);
    formRef?.current?.addEventListener<any>('fieldTouch', onTouchCallback);
    return () => {
      formRef?.current?.removeEventListener<any>('fieldChange', onChangeCallback);
      formRef?.current?.removeEventListener<any>('fieldTouch', onTouchCallback);
    };
  }, [formRef]);
  const onSubmitCallback = async () => {
    const isValid = await api.validate();
    if (isValid) {
      onSubmit(api, api.getValues());
    } else {
      if (typeof onError === 'function') {
        onError(api, api.getErrors());
      }
    }
  };
  const onChangeCallback = (e: CustomEvent<FieldChangeEventInterface>) => {
    if (typeof onChange === 'function') {
      onChange(api, e.detail.id, e.detail.value);
    }
    // TODO improve
    const isChanged = !isEqual(api.getDefaultValues(), api.getValues());
    if (api.isChanged() !== isChanged) {
      api.setChanged(isChanged);
    }
  };
  const onTouchCallback = (e: CustomEvent<FieldTouchEventInterface>) => {
    if (typeof onTouch === 'function') {
      onTouch(api, e.detail.id);
    }
  };

  const childrenComponent = typeof children === 'function' ? children(api) : children;

  return (
    <>
      <form {...props} onSubmit={onSubmitCallback} ref={formRef}>
        {childrenComponent}
      </form>
    </>
  );
};

FormProviderComponent.displayName = 'FormProvider';
export const FormProvider = FormProviderComponent;
