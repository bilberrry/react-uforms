/// <reference types="typescript" />
import React from 'react';

export interface FormProps {
  defaultValues: any;
  onSubmit: void;
  onError?: void;
  validation: void;
  errorClass: string;
  invalidClass: string;
  children?: (api: FormApi) => React.Component | React.Component;
}
interface AnyObj {
  [key: string]: AnyObj | AnyObj[] | string | boolean | null | number
}
interface FormApi {
  setTouched: (name: string) => undefined;
  setValue: (name: string, value: string, callback: void) => undefined;
  getValue: (name: string) => any;
  removeValue: (name: string) => undefined;
  getErrors: (name: string) => string[];
  setErrors: (name: string, value: string[], callback: void) => undefined;
  getErrorClass: () => string;
  getInvalidClass: () => string;
  getAllValues: () => AnyObj;
  getAllErrors: () => AnyObj;
  setAllErrors: (errors: AnyObj, callback: void) => undefined;
  setAllValues: (values: AnyObj, callback: void) => undefined;
  getAllDisabled: () => string[];
  setDisabled: (name: string) => undefined;
  removeDisabled: (name: string) => undefined;
  isDisabled: (name: string) => boolean;
  getValuesDiff: (maxLevel: number) => AnyObj;
  hasChanges: () => boolean;
  submit: () => undefined;
}
export class Form extends React.Component<FormProps> {}

interface HocFieldProps {
  getValue?: void;
  setValue?: void;
  setTouched?: void;
  onChange?: void;
  onBlur?: void;
}
interface FieldProps {
  name: string;
  className?: string;
  hideError?: boolean;
  disabled?: boolean;
}
export const Field: <P extends FieldProps>(Component: React.ComponentType<P>) =>  React.ComponentType<P> & HocFieldProps;

export interface FieldErrorProps {
  name: string;
}
export const FieldError: React.FunctionComponent<FieldErrorProps>;

export interface CheckboxProps {
  onValue: string | boolean | number;
  offValue: string | boolean | number;
}
export const Checkbox: React.FunctionComponent<CheckboxProps>;

export const CustomField: React.FunctionComponent;

export interface RadioProps {
  value: string | number;
}
export const Radio: React.FunctionComponent<RadioProps>;

export interface RadioGroupProps {
  value: string | number;
}
export const RadioGroup: React.FunctionComponent<RadioGroupProps>;

export interface RadioGroupItemProps {
  name: string;
  children: React.Component,
}
export const RadioGroupItem: React.FunctionComponent<RadioGroupItemProps>;

interface Option {
  name: string | number;
  value: string | number;
  disabled?: boolean;
}
export interface SelectProps {
  options: Option[];
}
export const Select: React.FunctionComponent<SelectProps>;

export interface TextProps {
  emptyValue: string,
}
export const Text: React.FunctionComponent<TextProps>;

export interface TextAreaProps {
  emptyValue: string,
}
export const TextArea: React.FunctionComponent<TextAreaProps>;
