import React, { PropsWithoutRef, ReactElement, ReactNode, useEffect, useRef } from 'react';
import { useForm } from '../hooks';
import {
  ClassesInterface,
  FieldChangeEventInterface,
  FieldTouchEventInterface,
  FieldValueType,
  FormApiInterface,
  FormErrorsType,
  FormValues,
  PartialFormValues,
  ValidationType,
} from '../types';
import isEqual from 'lodash.isequal';

type FormApiChildren<Values extends FormValues> = (api: FormApiInterface<Values>) => ReactNode;

export interface OnSubmitParams<Values extends FormValues> {
  api: FormApiInterface<Values>;
  values: Values;
}

export interface OnChangeParams<Values extends FormValues> {
  api: FormApiInterface<Values>;
  changedField: string;
  fieldValue: FieldValueType;
}

export interface OnTouchParams<Values extends FormValues> {
  api: FormApiInterface<Values>;
  touchedField: string;
}

export interface OnErrorParams<Values extends FormValues> {
  api: FormApiInterface<Values>;
  errors: FormErrorsType;
}

export interface FormProps<Values extends FormValues>
  extends Omit<
    React.HTMLProps<HTMLFormElement & HTMLDivElement>,
    'onChange' | 'onSubmit' | 'onError' | 'defaultValues' | 'children'
  > {
  children: ReactNode | FormApiChildren<Values>;
  onSubmit: (params: OnSubmitParams<Values>) => void;
  defaultValues?: PartialFormValues<Values>;
  onChange?: (params: OnChangeParams<Values>) => void;
  onTouch?: (params: OnTouchParams<Values>) => void;
  onError?: (params: OnErrorParams<Values>) => void;
  validation?: ValidationType;
  classes?: Partial<ClassesInterface>;
  stripUnknown?: boolean;
}

export const defaultClasses: ClassesInterface = {
  field: {
    error: 'invalid-feedback',
    invalid: 'is-invalid',
  },
  group: {
    active: 'active',
    valid: 'is-invalid',
    touched: 'is-touched',
    disabled: 'is-disabled',
  },
} as const;

const FormProviderComponent = <Values extends FormValues>({
  children,
  defaultValues,
  onSubmit,
  onError,
  onChange,
  onTouch,
  validation,
  stripUnknown,
  classes,
  ...props
}: PropsWithoutRef<FormProps<Values>>): ReactElement | null => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const api = useForm<Values>();
  useEffect(() => {
    api.setDefaultValues({ ...defaultValues } as Values);
    api.setDynamicValues({ ...defaultValues } as Values);
    api.setValues({ ...defaultValues } as Values);
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
    api.setValidation(validation);
  }, [validation]);
  useEffect(() => {
    api.setStripUnknown(!!stripUnknown);
  }, [stripUnknown]);
  useEffect(() => {
    formRef?.current?.addEventListener<any>('fieldChange', onChangeCallback);
    formRef?.current?.addEventListener<any>('fieldTouch', onTouchCallback);
    return () => {
      formRef?.current?.removeEventListener<any>('fieldChange', onChangeCallback);
      formRef?.current?.removeEventListener<any>('fieldTouch', onTouchCallback);
    };
  }, [formRef]);
  const onSubmitCallback = async (e) => {
    e.preventDefault();
    try {
      const values = await api.validate();
      onSubmit({
        api,
        values,
      });
    } catch (e) {
      if (typeof onError === 'function') {
        onError({
          api,
          errors: api.getErrors(),
        });
      }
    }
  };
  const onChangeCallback = (e: CustomEvent<FieldChangeEventInterface>) => {
    if (typeof onChange === 'function') {
      onChange({
        api,
        changedField: e.detail.id,
        fieldValue: e.detail.value,
      });
    }
    // TODO improve
    const isChanged = !isEqual(api.getDefaultValues(), api.getValues());
    if (api.isChanged() !== isChanged) {
      api.setChanged(isChanged);
    }
  };
  const onTouchCallback = (e: CustomEvent<FieldTouchEventInterface>) => {
    if (typeof onTouch === 'function') {
      onTouch({
        api,
        touchedField: e.detail.id,
      });
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
