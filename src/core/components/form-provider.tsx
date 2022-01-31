import React, { PropsWithRef, ReactElement, ReactNode, useEffect, useRef } from 'react';
import { useForm } from '../hooks';
import {
  ClassesInterface,
  FieldChangeEventInterface,
  FieldTouchEventInterface,
  FieldValueType,
  FormApiInterface,
  FormErrorsType,
  FormValues,
  SomeFormValues,
  ValidationType,
} from '../types';
import isEqual from 'lodash.isequal';

type FormApiChildren<Values extends FormValues> = (api: FormApiInterface<Values>) => ReactNode;

export interface FormProps<Values extends FormValues>
  extends Omit<
    React.HTMLProps<HTMLFormElement & HTMLDivElement>,
    'onChange' | 'onSubmit' | 'onError' | 'defaultValues'
  > {
  children: ReactNode | FormApiChildren<Values>;
  onSubmit: (api: FormApiInterface<Values>, values: SomeFormValues<Values>) => void;
  defaultValues?: SomeFormValues<Values>;
  onChange?: (api: FormApiInterface<Values>, changedField: string, fieldValue: FieldValueType) => void;
  onTouch?: (api: FormApiInterface<Values>, touchedField: string) => void;
  onError?: (api: FormApiInterface<Values>, errors: FormErrorsType) => void;
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
}: PropsWithRef<FormProps<Values>>): ReactElement | null => {
  const formRef = useRef<HTMLFormElement | null>(null); // TODO forwardRef
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
      onSubmit(api, values);
    } catch (e) {
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
