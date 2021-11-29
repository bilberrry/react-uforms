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
  GroupClasses,
} from './types';
import { defaultClasses } from './components/form-provider';
import { RefObject } from 'react';
import oGet from 'lodash.get';
import oSet from 'lodash.set';
import { isArrayHasPromise, isPromise } from './helpers';

export const { Provider: FormStoreProvider, useStore: useFormStore } = createContext<FormStateInterface<any>>();

const validateValue = async (value, validators: ValidatorsType): Promise<Array<string>> => {
  const errors: Array<string> = [];
  for (let i = 0; i < validators.length; i++) {
    const validator = validators[i];
    try {
      const message = isPromise(validator) ? await validator(value) : validator(value);
      if (message && typeof message === 'string') {
        errors.push(message);
        break;
      }
    } catch (e: any) {
      errors.push(e?.message || 'Value is invalid');
      break;
    }
  }

  return errors;
};

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
    // TODO refactor
    async validate(): Promise<boolean> {
      const validators: ValidatorsType = [...field.validators, ...(oGet(get().form.validation, field.id) || [])];
      if (isArrayHasPromise(validators)) {
        setField(field.id, { isValidating: true });
      }
      const errors = await validateValue(field.value, validators);
      setField(field.id, { errors, isValid: errors.length === 0, isValidating: false });

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
      return get()
        .fields.filter((item) => item.group === group.name)
        .map(({ id, errors }) => ({
          id,
          errors,
        }));
    },
    /* ========= Group Disabled ========= */
    isDisabled(): boolean {
      return group.isDisabled;
    },
    setDisabled(value = true): void {
      setGroup(group.name, { isDisabled: value });
    },
    /* ========= Group Active ========= */
    isActive(): boolean {
      return group.isActive;
    },
    setActive(): void {
      set((state) => ({
        groups: state.groups.map((item) => {
          return {
            ...item,
            isActive: group.name === item.name,
            ...(group.name === item.name ? { isTouched: true } : {}),
          };
        }),
      }));
    },
    /* ========= Group Touch ========= */
    isTouched(): boolean {
      return group.isTouched;
    },
    setTouched(value: boolean): void {
      setGroup(group.name, { isTouched: value });
    },
    /* ========= Group Valid ========= */
    isValid(): boolean {
      return group.isValid;
    },
    isValidating(): boolean {
      return group.isValidating;
    },
    /* ========= Group Validation ========= */
    async validate(): Promise<boolean> {
      const fields = get().fields.filter((item) => item.group === group.name);
      const promises: Array<Promise<boolean>> = [];
      setGroup(group.name, { isValidating: true });
      for (let i = 0; i < fields.length; i++) {
        const field: FieldInterface = fields[i];
        const validators: ValidatorsType = [...field.validators, ...(oGet(get().form.validation, field.id) || [])];
        const callback = async (): Promise<boolean> => {
          const errors = await validateValue(field.value, validators);
          setField(field.id, { errors, isValid: errors.length === 0, isValidating: false });
          return errors.length === 0;
        };
        promises.push(callback());
      }
      const result = await Promise.all(promises);
      const isValid = !result.some((i) => !i);
      setGroup(group.name, { isValidating: false, isValid });

      return isValid;
    },
    remove(): void {
      set((state) => ({
        groups: state.groups.filter((i) => i.name !== group.name),
      }));
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
  const validate = async (): Promise<boolean> => {
    const fields = get().fields;
    const promises: Array<Promise<boolean>> = [];
    set({ form: { ...get().form, isValidating: true } });
    for (let i = 0; i < fields.length; i++) {
      const field: FieldInterface = fields[i];
      const validators: ValidatorsType = [...field.validators, ...(oGet(get().form.validation, field.id) || [])];
      const callback = async () => {
        const errors = await validateValue(field.value, validators);
        setField(field.id, { errors, isValid: errors.length === 0, isValidating: false });
        return errors.length === 0;
      };
      promises.push(callback());
    }
    const result = await Promise.all(promises);
    const isValid = !result.some((i) => !i);
    set({ form: { ...get().form, isValidating: false, isValid } });

    return isValid;
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
    getErrors(): FormErrorsType {
      return get().fields.map(({ id, errors }) => ({
        id,
        errors,
      }));
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
    validate,
    getField,
    groupsApi: {
      getClasses(): GroupClasses {
        return get().form.classes.group;
      },
      async nextGroup(): Promise<boolean> {
        const activeIndex = get().groups.findIndex((item) => item.isActive);
        const activeGroup = get().groups[activeIndex];
        if (activeIndex === get().groups.length - 1) {
          if (await getGroup(activeGroup.name).validate()) {
            return validate();
          }
        } else if (activeIndex < get().groups.length - 1) {
          const nextGroup = get().groups[activeIndex + 1];
          if (await getGroup(activeGroup.name).validate()) {
            getGroup(nextGroup.name).setActive();
            return true;
          }
        }

        return false;
      },
      prevGroup(): void {
        const activeIndex = get().groups.findIndex((item) => item.isActive);
        if (activeIndex > 0) {
          const prevGroup = get().groups[activeIndex - 1];
          getGroup(prevGroup.name).setActive();
        }
      },
      getGroup,
    },
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
    const getGroup = (
      groupName: string,
      autoCreate = false,
      data: Partial<GroupInterface> = {},
    ): GroupApiInterface | undefined => {
      let group: GroupInterface | undefined = get().groups.find((item) => item.name === groupName);
      if (!group && autoCreate) {
        group = {
          name: groupName,
          isValidating: false,
          isDisabled: false,
          isTouched: false,
          isActive: false,
          isValid: false,
          ...data,
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
