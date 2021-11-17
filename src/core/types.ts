import { RefObject } from 'react';

// export type ValueType = string | number | boolean | null;
export type ValidationType = any;
export type FieldValueType = any; //ValueType | Array<ValueType>;
export type FieldErrorType = string;
export type FieldErrorsType = Array<FieldErrorType>;
export type ValidatorType = (value: FieldValueType) => Promise<string | boolean>;
export type ValidatorsType = Array<ValidatorType>;
//
// export interface FieldSetterInterface {
//   id: string;
// }
// export interface FieldGetterInterface {
//   id: string;
//   callback: (value: FieldValueType) => void;
// }

export interface FieldInterface {
  id: string;
  isValidating: boolean;
  isDisabled: boolean;
  isTouched: boolean;
  isValid: boolean;
  value: FieldValueType;
  validators: ValidatorsType;
  errors: FieldErrorsType;
}

export interface FormErrorItemInterface {
  id: string;
  errors: FieldErrorsType;
}

export type FormErrorsType = Array<FormErrorItemInterface>;
export interface FormStateInterface<Values> {
  form: {
    defaultValues: any;
    isValidating: boolean;
    isTouched: boolean;
    isValid: boolean;
    isChanged: boolean;
    formRef: RefObject<HTMLFormElement> | null;
    classes: ClassesInterface;
    validation: ValidationType;
  };
  fields: Array<FieldInterface>;
  formApi: FormApiInterface<Values>;
}

export interface FieldClasses {
  error: string;
  invalid: string;
}

export interface FieldGroupClasses {
  active: string;
  errors: string;
  touched: string;
  completed: string;
}

export interface ClassesInterface {
  field: FieldClasses;
  fieldGroup: FieldGroupClasses;
}
export interface FieldChangeEventInterface {
  id: string;
  value: FieldValueType;
}
export interface FieldTouchEventInterface {
  id: string;
}

export interface FieldApiInterface {
  getObject: () => FieldInterface;
  getValue: () => FieldValueType;
  setValue: (value: FieldValueType) => void;
  getErrors: () => FieldErrorsType;
  addError: (error: FieldErrorType) => void;
  setErrors: (errors: FieldErrorsType) => void;
  getInputClassName: (existedClassName?: string) => string;
  getErrorClassName: (existedClassName?: string) => string;
  getValidators: () => ValidatorsType;
  setValidators: (validators: ValidatorsType) => void;
  isDisabled: () => boolean;
  setDisabled: (value: boolean) => void;
  isTouched: () => boolean;
  setTouched: () => void;
  isValid: () => boolean;
  isValidating: () => boolean;
  validate: () => Promise<boolean>;
}

export interface FormApiInterface<Values> {
  setDefaultValues: (values: Values) => void;
  getDefaultValues: () => Values;
  setClasses: (values: ClassesInterface) => void;
  getClasses: () => ClassesInterface;
  setValidation: (validation: ValidationType) => void;
  getValidation: () => ValidationType;
  setFormRef: (value: RefObject<HTMLFormElement> | null) => void;
  getFormRef: () => RefObject<HTMLFormElement> | null;
  setValues: (values: Values) => void;
  getValues: () => Values;
  validate: () => Promise<boolean>;
  setErrors: (formErrors: FormErrorsType) => void;
  getErrors: () => FormErrorsType;
  getField: (id: string, autoCreate?: boolean) => FieldApiInterface | undefined;
  isTouched: () => boolean;
  isValid: () => boolean;
  isChanged: () => boolean;
  setChanged: (value: boolean) => void;
  isValidating: () => boolean;
  submit: () => void;
}

export interface FieldPassedProps {
  name: string;
  disabled?: boolean;
  hideError?: boolean;
  validators?: ValidatorsType;
}

export interface FieldProps {
  autoCreate?: boolean;
  disabled?: boolean;
  validators?: ValidatorsType;
}
