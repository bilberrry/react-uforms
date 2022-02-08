import { Ref, RefObject } from 'react';

export type ValidationType = any;
export type FieldValueType = any; //string | number | boolean | null | Record<string, unknown>;
export type FieldErrorType = string;
export type FieldErrorsType = Array<FieldErrorType>;
export type FormValues = { [key: string]: unknown };
export type PartialFormValues<V extends FormValues> = Partial<V>;

export interface FieldInterface {
  id: string;
  isValidating: boolean;
  isDisabled: boolean;
  isTouched: boolean;
  isValid: boolean;
  group: string | null;
  value: FieldValueType;
  errors: FieldErrorsType;
}

export interface GroupInterface {
  name: string;
  isDisabled: boolean;
  isValidating: boolean;
  isTouched: boolean;
  isValid: boolean;
  isActive: boolean;
}
export interface FormErrorItemInterface {
  id: string;
  errors: FieldErrorsType;
}

export type FormErrorsType = Array<FormErrorItemInterface>;
export interface FormStateInterface<Values extends FormValues> {
  form: {
    defaultValues: PartialFormValues<Values>;
    isStripUnknown: boolean;
    isValidating: boolean;
    isTouched: boolean;
    isValid: boolean;
    isChanged: boolean;
    formRef: RefObject<HTMLFormElement> | null;
    classes: ClassesInterface;
    validation: ValidationType;
  };
  dynamicValues: PartialFormValues<Values>;
  fields: Array<FieldInterface>;
  formApi: FormApiInterface<Values>;
  groups: Array<GroupInterface>;
}

export interface FieldClasses {
  error: string;
  invalid: string;
}

export interface GroupClasses {
  active: string;
  valid: string;
  touched: string;
  disabled: string;
}

export interface ClassesInterface {
  field: FieldClasses;
  group: GroupClasses;
}
export interface FieldChangeEventInterface {
  id: string;
  value: FieldValueType;
}
export interface FieldTouchEventInterface {
  id: string;
}

export interface GroupsApiInterface {
  prevGroup: () => void;
  nextGroup: () => Promise<boolean>;
  getClasses: () => GroupClasses;
  getGroup: (groupName: string, autoCreate?: boolean, data?: Partial<GroupInterface>) => GroupApiInterface | undefined;
}

export interface GroupApiInterface {
  getObject: () => GroupInterface;
  getErrors: () => FormErrorsType;
  isDisabled: () => boolean;
  setDisabled: (value: boolean) => void;
  isActive: () => boolean;
  setActive: () => void;
  isTouched: () => boolean;
  setTouched: (value: boolean) => void;
  isValid: () => boolean;
  isValidating: () => boolean;
  validate: () => Promise<boolean>;
  remove: () => void;
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
  isDisabled: () => boolean;
  setDisabled: (value: boolean) => void;
  getGroup: () => string | null;
  setGroup: (groupName: string | null) => void;
  isTouched: () => boolean;
  setTouched: () => void;
  remove: () => void;
  isValid: () => boolean;
  isValidating: () => boolean;
  validate: () => Promise<boolean>;
}

export interface FormApiInterface<Values extends FormValues> {
  setDefaultValues: (values: PartialFormValues<Values>) => void;
  getDefaultValues: () => PartialFormValues<Values>;
  setStripUnknown: (isStripUnknown: boolean) => void;
  isStripUnknown: () => boolean;
  setDynamicValues: (values: PartialFormValues<Values>) => void;
  getDynamicValues: () => PartialFormValues<Values>;
  setClasses: (values: ClassesInterface) => void;
  getClasses: () => ClassesInterface;
  setValidation: (validation: ValidationType) => void;
  getValidation: () => ValidationType;
  setFormRef: (value: RefObject<HTMLFormElement> | null) => void;
  getFormRef: () => RefObject<HTMLFormElement> | null;
  setValues: (values: PartialFormValues<Values>) => void;
  getValues: () => Values;
  validate: () => Promise<Values>;
  setErrors: (formErrors: FormErrorsType) => void;
  getErrors: () => FormErrorsType;
  isTouched: () => boolean;
  isValid: () => boolean;
  isChanged: () => boolean;
  setChanged: (value: boolean) => void;
  isValidating: () => boolean;
  submit: () => void;
  getField: (fieldId: NestedKeys<Values>, autoCreate?: boolean) => FieldApiInterface | undefined;
  groupsApi: GroupsApiInterface;
  getFieldArray: (fieldId: string) => FieldArrayApiInterface | undefined;
}

export interface FieldArrayApiInterface {
  addItem: (data?: any, index?: number) => void;
  removeItem: (index: number) => void;
  moveItem: (fromIndex: number, toIndex: number) => void;
  setItems: (items: Array<any>) => void;
  getItems: () => Array<any>;
}

export interface FieldPassedProps<Values extends FormValues> {
  name: NestedKeys<Values>;
  disabled?: boolean;
  hideError?: boolean;
  dependsOn?: Array<string>;
}

export interface FieldRefProp<T> {
  uRef?: Ref<T>;
}

export interface UseFieldProps {
  autoCreate?: boolean;
  disabled?: boolean;
  dependsOn?: Array<string>;
}

export interface UseGroupProps {
  autoCreate?: boolean;
  defaultActive?: boolean;
}

type NestedPrefix<T extends string> = T extends '' ? '' : `.${T}`;

export type NestedKeys<T> = (
  T extends object
    ? T extends Array<infer Item>
      ? { [K in Exclude<keyof Item, symbol>]: `${number}.${K}${NestedPrefix<NestedKeys<Item[K]>>}` }[Exclude<
          keyof Item,
          symbol
        >]
      : { [K in Exclude<keyof T, symbol>]: `${K}${NestedPrefix<NestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
    : ''
) extends infer D
  ? Extract<D, string>
  : never;
