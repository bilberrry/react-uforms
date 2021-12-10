import { ClassesInterface, FormApiInterface, FormErrorsType, GroupClasses, ValidationType } from '../types';
import { RefObject } from 'react';
import oGet from 'lodash.get';
import { commonApiPure } from './common';

export const formApiPure = <Values,>(set, get, getField, getGroup, getArrField): FormApiInterface<Values> => {
  const { setField, getValues, validate } = commonApiPure(set, get);
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
    getArrField,
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
