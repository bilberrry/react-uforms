import { ArrFieldInterface, FieldInterface, GroupInterface } from '../types';
import oSet from 'lodash.set';

export const commonApiPure = (set, get) => {
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
  const getValues = (): any => {
    const {
      fields,
      arrFields,
      form: { defaultValues },
    } = get();
    const values = JSON.parse(JSON.stringify(defaultValues));
    for (let i = 0; i < fields.length; i++) {
      oSet(values, fields[i].id, fields[i].value);
    }
    for (let i = 0; i < arrFields.length; i++) {
      const arrField = arrFields[i];
      oSet(values, arrFields[i].id, []);
      for (let j = 0; j < arrField.fields.length; j++) {
        const aFields = fields.filter((item) => item.id.indexOf(arrField.fields[j]) === 0);
        for (let k = 0; k < aFields.length; k++) {
          const regex = /\.[0-9]+\./i;
          const newId = aFields[k].id.toString().replace(regex, `.${j}.`);
          oSet(values, newId, aFields[k].value);
        }
      }
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
  const setArrField = (id: string, data: Partial<ArrFieldInterface>) => {
    set((state) => ({
      arrFields: state.arrFields.map((item) => {
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
    setField,
    setFields,
    setArrField,
    setGroup,
    getValues,
    validate,
  };
};
