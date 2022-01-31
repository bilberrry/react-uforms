import { FieldInterface, FormErrorsType, GroupApiInterface, GroupInterface } from '../types';
import { commonApiPure } from './common';

export const groupApiPure = (set, get, group): GroupApiInterface => {
  const { setFields, getValues, setGroup } = commonApiPure(set, get);

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
