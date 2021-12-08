import create from 'zustand';
import createContext from 'zustand/context';
import {
  ClassesInterface,
  FieldApiInterface,
  FieldChangeEventInterface,
  FieldErrorsType,
  FieldErrorType,
  FieldInterface,
  FieldTouchEventInterface,
  FieldValueType,
  FormApiInterface,
  FormErrorsType,
  FormStateInterface,
  GroupApiInterface,
  GroupClasses,
  GroupInterface,
  ValidationType,
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
  const getValues = (): any => {
    const {
      fields,
      form: { defaultValues },
    } = get();
    const values = JSON.parse(JSON.stringify(defaultValues));
    for (let i = 0; i < fields.length; i++) {
      oSet(values, fields[i].id, fields[i].value);
    }
    return values;
  };
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

/* ============================= */
/* ========= Group API ========= */
/* ============================= */
const groupApiPure = (set, get, group): GroupApiInterface => {
  const setFields = (
    ids: Array<string>,
    data: Array<Partial<FieldInterface>>,
    defaultData: Partial<FieldInterface> = {},
  ) => {
    set((state) => ({
      fields: state.fields.map((item) => {
        const index = ids.indexOf(item.id);
        return {
          ...item,
          ...(index > -1 ? data[index] : defaultData),
        };
      }),
    }));
  };
  const getValues = (): any => {
    const {
      fields,
      form: { defaultValues },
    } = get();
    const values = JSON.parse(JSON.stringify(defaultValues));
    for (let i = 0; i < fields.length; i++) {
      oSet(values, fields[i].id, fields[i].value);
    }
    return values;
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
      const validation = get().form.validation;
      if (!validation) {
        return true;
      }
      const fields = get().fields.filter((item) => item.group === group.name);
      const values = getValues();
      const ids: Array<string> = [];
      const data: Array<Partial<FieldInterface>> = [];
      let isValid = true;

      setGroup(group.name, { isValidating: true });

      for (let i = 0; i < fields.length; i++) {
        const field: FieldInterface = fields[i];
        try {
          await validation.validateAt(field.id, values, { abortEarly: false });
          ids.push(field.id);
          data.push({ errors: [], isValid: true });
        } catch (err: any) {
          isValid = false;
          ids.push(field.id);
          data.push({ errors: err.errors, isValid: false });
        }
      }

      setFields(ids, data);
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
  const setFields = (
    ids: Array<string>,
    data: Array<Partial<FieldInterface>>,
    defaultData: Partial<FieldInterface> = {},
  ) => {
    set((state) => ({
      fields: state.fields.map((item) => {
        const index = ids.indexOf(item.id);
        return {
          ...item,
          ...(index > -1 ? data[index] : defaultData),
        };
      }),
    }));
  };

  const getValues = (): Values => {
    const {
      fields,
      form: { defaultValues },
    } = get();
    const values = JSON.parse(JSON.stringify(defaultValues));
    for (let i = 0; i < fields.length; i++) {
      oSet(values, fields[i].id, fields[i].value);
    }
    return values;
  };

  const validate = async (): Promise<boolean> => {
    const validation = get().form.validation;
    if (!validation) {
      return true;
    }
    const values = getValues();
    const ids: Array<string> = [];
    const data: Array<Partial<FieldInterface>> = [];
    let isValid = false;

    set({ form: { ...get().form, isValidating: true } });

    try {
      await validation.validate(values, { abortEarly: false });
      isValid = true;
    } catch (err: any) {
      for (let i = 0; i < err.inner.length; i++) {
        const { path, errors } = err.inner[i];
        ids.push(path as string);
        data.push({ errors: errors, isValid: false });
      }
    }
    setFields(ids, data, { errors: [], isValid: true });
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
    getValues,
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
