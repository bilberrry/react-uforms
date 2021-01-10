export type FieldErrorType = string;
export interface FieldValidatorInterface {
  id: string;
  callback: (value: any) => string | boolean;
}
export interface FieldSetterInterface {
  id: string;
}
export interface FieldGetterInterface {
  id: string;
  callback: (value: any) => void;
}

export interface FieldInterface {
  id: string;
  isValidating: boolean;
  isDisabled: boolean;
  isTouched: boolean;
  isValid: boolean;
  isMounted: boolean;
  value: any;
  setters: FieldSetterInterface[];
  getters: FieldGetterInterface[];
  validators: FieldValidatorInterface[];
  errors: FieldErrorType[];
}

export interface FormStateInterface {
  defaultValues: {};
  fields: FieldInterface[];
  isValidating: boolean;
  isTouched: boolean;
  isValid: boolean;
}
