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
  ValidatorsType, FieldErrorsType,
} from './types';
import { defaultClasses } from './components/form-provider';
import { RefObject } from 'react';
import oGet from 'lodash.get';
import oSet from 'lodash.set';

export const { Provider: FormStoreProvider, useStore: useFormStore } = createContext<FormStateInterface<any>>();

export const createFormStore = <Values,>() =>
  create<FormStateInterface<Values>>((set, get) => {
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
    const getField = (fieldId: string, autoCreate = false): FieldApiInterface | undefined => {
      let field: FieldInterface | undefined = get().fields.find((item) => item.id === fieldId);
      if (!field && autoCreate) {
        field = {
          id: fieldId,
          isValidating: false,
          isDisabled: false,
          isTouched: false,
          isValid: true,
          value: oGet(get().defaultValues, fieldId),
          validators: [],
          errors: [],
        };
        set({ fields: [...get().fields, field] });
      }
      return field ? fieldApiPure(field) : undefined;
    };
    const formApi: FormApiInterface<Values> = {
      setDefaultValues(defaultValues): void {
        set({ defaultValues });
      },
      getDefaultValues(): Values {
        return get().defaultValues;
      },
      setClasses(classes: ClassesInterface): void {
        set({ classes });
      },
      getClasses(): ClassesInterface {
        return get().classes;
      },
      setValidation(validation: ValidationType): void {
        set({ validation });
      },
      getValidation(): ValidationType {
        return get().validation;
      },
      setFormRef(formRef: RefObject<HTMLFormElement> | null): void {
        set({ formRef });
      },
      getFormRef(): RefObject<HTMLFormElement> | null {
        return get().formRef;
      },
      submit(): void {
        const event = new Event('submit', { cancelable: true, bubbles: true });
        get().formRef?.current?.dispatchEvent(event);
      },
      getValues(): Values {
        const { fields, defaultValues } = get();
        const values = JSON.parse(JSON.stringify(defaultValues));
        for (let i = 0; i < fields.length; i++) {
          oSet(values, fields[i].id, fields[i].value);
        }
        return values;
      },
      async validate(): Promise<boolean> {
        const { fields } = get();
        let isValid = true;
        set({ isValidating: true });
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];
          setField(field.id, { isValidating: true });
          const errors: string[] = [];
          const validators = [...field.validators, ...(oGet(get().validation, field.id) || [])];
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
        set({ isValidating: false });

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
        return get().isTouched;
      },
      isValid(): boolean {
        return get().isValid;
      },
      setChanged(value: boolean): void {
        set({ isChanged: value });
      },
      isChanged(): boolean {
        return get().isChanged;
      },
      isValidating(): boolean {
        return get().isValidating;
      },
      getField,
    };
    const fieldApiPure = (field: FieldInterface): FieldApiInterface => ({
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
        get().formRef?.current?.dispatchEvent(event);
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
      isTouched(): boolean {
        return !!field?.isTouched;
      },
      setTouched(): void {
        if (!get().isTouched) {
          setField(field.id, { isTouched: true });
        }
        const event = new CustomEvent<FieldTouchEventInterface>('fieldTouch', { detail: { id: field.id } });
        get().formRef?.current?.dispatchEvent(event);
      },
      isValid(): boolean {
        return !!field?.isValid;
      },
      isValidating(): boolean {
        return !!field?.isValidating;
      },
      getInputClassName(existClassName?: string): string {
        const classNames = existClassName ? [existClassName] : [];
        const { invalid } = get().classes.field;
        const errors = field.errors;
        if (errors && errors.length > 0 && invalid) {
          classNames.push(invalid);
        }
        return classNames.join(' ');
      },
      getErrorClassName(existClassName?: string): string {
        const classNames = existClassName ? [existClassName] : [];
        const { error } = get().classes.field;
        const errors = field.errors;
        if (errors && errors.length > 0 && error) {
          classNames.push(error);
        }
        return classNames.join(' ');
      },
      async validate(): Promise<boolean> {
        // TODO check if Promise exist
        setField(field.id, { isValidating: true });
        const errors: string[] = [];
        const validators = [...field.validators, ...(oGet(get().validation, field.id) || [])];
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
    });
    return {
      defaultValues: {},
      fields: [],
      isValidating: false,
      isTouched: false,
      isValid: true,
      isChanged: false,
      formRef: null,
      validation: {},
      classes: defaultClasses,
      formApi,
    };
  });
