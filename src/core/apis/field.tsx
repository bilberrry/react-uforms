import {
  FieldApiInterface,
  FieldChangeEventInterface,
  FieldErrorsType,
  FieldErrorType,
  FieldInterface,
  FieldTouchEventInterface,
  FieldValueType,
} from '../types';
import { commonApiPure } from './common';

export const fieldApiPure = (set, get, field): FieldApiInterface => {
  const { setField, getValues } = commonApiPure(set, get);
  return {
    /* ========= Field ========= */
    getObject(): FieldInterface {
      return field;
    },
    /* ========= Field Value ========= */
    getValue(): FieldValueType {
      return field.value;
    },
    setValue(value: FieldValueType): void {
      setField(field.id, { value });
      const event = new CustomEvent<FieldChangeEventInterface>('fieldChange', { detail: { id: field.id, value } });
      get().form.formRef?.current?.dispatchEvent(event);
    },
    /* ========= Field Errors ========= */
    getErrors(): FieldErrorsType {
      return field.errors;
    },
    addError(error: FieldErrorType): void {
      setField(field.id, { errors: [...field.errors, error] });
    },
    setErrors(errors: FieldErrorsType): void {
      setField(field.id, { errors });
    },
    /* ========= Field Disabled ========= */
    isDisabled(): boolean {
      return field.isDisabled;
    },
    setDisabled(value = true): void {
      setField(field.id, { isDisabled: value });
    },
    /* ========= Field Group ========= */
    getGroup(): string | null {
      return field.group;
    },
    setGroup(groupName: string | null): void {
      setField(field.id, { group: groupName });
    },
    /* ========= Field Touch ========= */
    isTouched(): boolean {
      return field.isTouched;
    },
    setTouched(): void {
      if (!get().form.isTouched) {
        setField(field.id, { isTouched: true });
      }
      const event = new CustomEvent<FieldTouchEventInterface>('fieldTouch', { detail: { id: field.id } });
      get().form.formRef?.current?.dispatchEvent(event);
    },
    remove(): void {
      set((state) => ({
        fields: state.fields.filter((item) => item.id !== field.id),
      }));
    },
    /* ========= Field Valid ========= */
    isValid(): boolean {
      return field.isValid;
    },
    isValidating(): boolean {
      return field.isValidating;
    },
    /* ========= Field Classes ========= */
    getInputClassName(existClassName?: string): string {
      const classNames = existClassName ? [existClassName] : [];
      const { invalid } = get().form.classes.field;
      const errors = field.errors;
      if (errors && errors.length > 0 && invalid) {
        classNames.push(invalid);
      }
      return classNames.join(' ');
    },
    getErrorClassName(existClassName?: string): string {
      const classNames = existClassName ? [existClassName] : [];
      const { error } = get().form.classes.field;
      const errors = field.errors;
      if (errors && errors.length > 0 && error) {
        classNames.push(error);
      }
      return classNames.join(' ');
    },
    /* ========= Field Validation ========= */
    async validate(): Promise<boolean> {
      const validation = get().form.validation;
      if (!validation) {
        return true;
      }
      const values = getValues();
      let isValid = false;

      setField(field.id, { isValidating: true });
      try {
        await validation.validateAt(field.id, values, { abortEarly: false });
        setField(field.id, { errors: [], isValid: true, isValidating: false });
        isValid = true;
      } catch (err: any) {
        setField(field.id, { errors: err.errors, isValid: false, isValidating: false });
      }

      return isValid;
    },
  };
};
