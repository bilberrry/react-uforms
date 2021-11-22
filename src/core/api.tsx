import create from 'zustand';
import createContext from 'zustand/context';
import {
  ClassesInterface,
  FormErrorsType,
  FieldInterface,
  FormStateInterface,
  FieldValueType,
  FieldErrorType,
  FormApiInterface,
  FieldApiInterface,
  FieldTouchEventInterface,
  FieldChangeEventInterface,
  ValidationType,
  ValidatorsType,
  FieldErrorsType,
  GroupInterface,
  GroupApiInterface,
} from './types';
import { defaultClasses } from './components/form-provider';
import { RefObject } from 'react';
import oGet from 'lodash.get';
import oSet from 'lodash.set';

export const { Provider: FormStoreProvider, useStore: useFormStore } = createContext<FormStateInterface<any>>();

/* ============================= */
/* ========= Field API ========= */
/* ============================= */
const fieldApiPure = (set, get, field): FieldApiInterface => {
  const setField = (id: string, data: Partial<FieldInterface>) => {
    set((state) => ({
      fields: state.fields.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      }),
    }));
  };
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
    /* ========= Field Validators ========= */
    getValidators(): ValidatorsType {
      return field.validators;
    },
    setValidators(validators: ValidatorsType): void {
      setField(field.id, { validators });
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
      return !!field?.isDisabled;
    },
    setDisabled(value = true): void {
      setField(field.id, { isDisabled: value });
    },
    /* ========= Field Touch ========= */
    isTouched(): boolean {
      return !!field?.isTouched;
    },
    setTouched(): void {
      if (!get().form.isTouched) {
        setField(field.id, { isTouched: true });
      }
      const event = new CustomEvent<FieldTouchEventInterface>('fieldTouch', { detail: { id: field.id } });
      get().form.formRef?.current?.dispatchEvent(event);
    },
    /* ========= Field Valid ========= */
    isValid(): boolean {
      return !!field?.isValid;
    },
    isValidating(): boolean {
      return !!field?.isValidating;
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
    // TODO refactor
    async validate(): Promise<boolean> {
      // TODO check if Promise exist
      setField(field.id, { isValidating: true });
      const errors: string[] = [];
      const validators: ValidatorsType = [...field.validators, ...(oGet(get().form.validation, field.id) || [])];
      for (let i = 0; i < validators.length; i++) {
        const validator = validators[i];
        const message = await validator(field.value);
        if (message && typeof message === 'string') {
          errors.push(message);
          setField(field.id, { errors });
          break;
        }
      }
      setField(field.id, { isValidating: false });

      return errors.length === 0;
    },
  };
};

/* ============================= */
/* ========= Group API ========= */
/* ============================= */
const groupApiPure = (set, get, group): GroupApiInterface => {
  const setField = (id: string, data: Partial<FieldInterface>) => {
    set((state) => ({
      fields: state.fields.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      }),
    }));
  };
  const setGroup = (name: string, data: Partial<GroupInterface>) => {
    set((state) => ({
      groups: state.groups.map((item) => {
        if (item.name === name) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      }),
    }));
  };
  return {
    /* ========= Group ========= */
    getObject(): GroupInterface {
      return group;
    },
    /* ========= Group Errors ========= */
    // TODO refactor
    getErrors(): FormErrorsType {
      const { fields } = get();
      const errors: FormErrorsType = [];
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (field.group !== group.name) {
          continue;
        }
        errors.push({
          id: field.id,
          errors: field.errors,
        });
      }
      return errors;
    },
    /* ========= Group Disabled ========= */
    isDisabled(): boolean {
      return !!group?.isDisabled;
    },
    setDisabled(value = true): void {
      setGroup(group.name, { isDisabled: value });
    },
    /* ========= Group Active ========= */
    isActive(): boolean {
      return !!group?.isActive;
    },
    setActive(): void {
      // setGroup(group.name, { isTouched: true });
    },
    /* ========= Group Touch ========= */
    isTouched(): boolean {
      return !!group?.isTouched;
    },
    setTouched(value: boolean): void {
      setGroup(group.name, { isTouched: value });
    },
    /* ========= Group Valid ========= */
    isValid(): boolean {
      return !!group?.isValid;
    },
    isValidating(): boolean {
      return !!group?.isValidating;
    },
    /* ========= Group Validation ========= */
    // TODO refactor
    async validate(): Promise<boolean> {
      const { fields } = get();
      let isValid = true;
      setGroup(group.name, { isValidating: true });
      for (let i = 0; i < fields.length; i++) {
        const field: FieldInterface = fields[i];
        if (field.group !== group.name) {
          continue;
        }
        setField(field.id, { isValidating: true });
        const errors: string[] = [];
        const validators: ValidatorsType = [...field.validators, ...(oGet(get().form.validation, field.id) || [])];
        for (let i = 0; i < validators.length; i++) {
          // TODO Promise All?
          const validator = validators[i];
          const message = await validator(field.value);
          if (message && typeof message === 'string') {
            errors.push(message);
            if (isValid) {
              isValid = false;
            }
            break;
          }
        }
        setField(field.id, { isValidating: false, errors });
      }
      setGroup(group.name, { isValidating: false });

      return isValid;
    },
  };
};

/* ============================= */
/* ========= Form API ========= */
/* ============================= */
const formApiPure = <Values,>(set, get, getField, getGroup): FormApiInterface<Values> => {
  const setField = (id: string, data: Partial<FieldInterface>) => {
    set((state) => ({
      fields: state.fields.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      }),
    }));
  };
  return {
    setDefaultValues(defaultValues): void {
      set({ form: { ...get().form, defaultValues } });
    },
    getDefaultValues(): Values {
      return get().form.defaultValues;
    },
    setClasses(classes: ClassesInterface): void {
      set({ form: { ...get().form, classes } });
    },
    getClasses(): ClassesInterface {
      return get().form.classes;
    },
    setValidation(validation: ValidationType): void {
      set({ form: { ...get().form, validation } });
    },
    getValidation(): ValidationType {
      return get().form.validation;
    },
    setFormRef(formRef: RefObject<HTMLFormElement> | null): void {
      set({ form: { ...get().form, formRef } });
    },
    getFormRef(): RefObject<HTMLFormElement> | null {
      return get().form.formRef;
    },
    submit(): void {
      const event = new Event('submit', { cancelable: true, bubbles: true });
      get().form.formRef?.current?.dispatchEvent(event);
    },
    getValues(): Values {
      const {
        fields,
        form: { defaultValues },
      } = get();
      const values = JSON.parse(JSON.stringify(defaultValues));
      for (let i = 0; i < fields.length; i++) {
        oSet(values, fields[i].id, fields[i].value);
      }
      return values;
    },
    // TODO refactor
    async validate(): Promise<boolean> {
      const { fields } = get();
      let isValid = true;
      set({ form: { ...get().form, isValidating: true } });
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        setField(field.id, { isValidating: true });
        const errors: string[] = [];
        const validators: ValidatorsType = [...field.validators, ...(oGet(get().form.validation, field.id) || [])];
        for (let i = 0; i < validators.length; i++) {
          // TODO Promise All?
          const validator = validators[i];
          const message = await validator(field.value);
          if (message && typeof message === 'string') {
            errors.push(message);
            if (isValid) {
              isValid = false;
            }
            break;
          }
        }
        setField(field.id, { isValidating: false, errors });
      }
      set({ form: { ...get().form, isValidating: false } });

      return isValid;
    },
    getErrors(): FormErrorsType {
      const { fields } = get();
      const errors: FormErrorsType = [];
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        errors.push({
          id: field.id,
          errors: field.errors,
        });
      }
      return errors;
    },
    setErrors(formErrors: FormErrorsType): void {
      // TODO one set
      for (let i = 0; i < formErrors.length; i++) {
        const { id, errors } = formErrors[i];
        setField(id, { errors });
      }
    },
    setValues(values: Values): void {
      // TODO one set
      const { fields } = get();
      for (let i = 0; i < fields.length; i++) {
        const { id } = fields[i];
        setField(id, { value: oGet(values, id) });
      }
    },
    isTouched(): boolean {
      return get().form.isTouched;
    },
    isValid(): boolean {
      return get().form.isValid;
    },
    setChanged(value: boolean): void {
      set({
        form: {
          ...get().form,
          isChanged: value,
        },
      });
    },
    isChanged(): boolean {
      return get().form.isChanged;
    },
    isValidating(): boolean {
      return get().form.isValidating;
    },
    getField,
    getGroup,
  };
};

/* ============================ */
/* ========= Form Store ======= */
/* ============================ */
export const createFormStore = <Values,>() =>
  create<FormStateInterface<Values>>((set, get) => {
    const getField = (fieldId: string, autoCreate = false): FieldApiInterface | undefined => {
      let field: FieldInterface | undefined = get().fields.find((item) => item.id === fieldId);
      if (!field && autoCreate) {
        field = {
          id: fieldId,
          isValidating: false,
          isDisabled: false,
          isTouched: false,
          isValid: false,
          group: null,
          value: oGet(get().form.defaultValues, fieldId),
          validators: [],
          errors: [],
        };
        set({ fields: [...get().fields, field] });
      }
      return field ? fieldApiPure(set, get, field) : undefined;
    };
    const getGroup = (groupName: string, autoCreate = false): GroupApiInterface | undefined => {
      let group: GroupInterface | undefined = get().groups.find((item) => item.name === groupName);
      if (!group && autoCreate) {
        group = {
          name: groupName,
          isValidating: false,
          isDisabled: false,
          isTouched: false,
          isActive: false,
          isValid: false,
        };
        set({ groups: [...get().groups, group] });
      }
      return group ? groupApiPure(set, get, group) : undefined;
    };
    const formApi = formApiPure<Values>(set, get, getField, getGroup);

    return {
      form: {
        defaultValues: {},
        isValidating: false,
        isTouched: false,
        isValid: true,
        isChanged: false,
        formRef: null,
        validation: {},
        classes: defaultClasses,
      },
      fields: [],
      groups: [],
      formApi,
    };
  });
