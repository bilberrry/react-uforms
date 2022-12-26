import { FieldInterface, GroupInterface } from '../types';
import oSet from 'lodash.set';
import cloneDeep from 'lodash.cloneDeep';

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
    const { fields, dynamicValues } = get();
    const values = cloneDeep(dynamicValues);

    for (let i = 0; i < fields.length; i++) {
      oSet(values, fields[i].id, fields[i].value);
    }

    return values;
  };
  const validate = async (): Promise<any> => {
    const { validation, isStripUnknown } = get().form;
    let values = getValues();
    let isValid = false;
    const ids: Array<string> = [];
    const data: Array<Partial<FieldInterface>> = [];

    if (!validation) {
      return values;
    }

    set({ form: { ...get().form, isValidating: true } });

    try {
      values = await validation.validate(values, { abortEarly: false, stripUnknown: isStripUnknown });
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

    if (!isValid) {
      // TODO refactor
      throw new Error('Validation error.');
    }

    return values;
  };
  const setFieldArray = (path: string, data: Array<any>) => {
    set((state) => {
      // TODO improve speed
      const dynamicValues = cloneDeep(state.dynamicValues);
      oSet(dynamicValues, path, data);
      return {
        dynamicValues,
      };
    });
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
  const submit = (): void => {
    const event = new Event('submit', { cancelable: true, bubbles: true });
    get().form.formRef?.current?.dispatchEvent(event);
  };
  return {
    setField,
    setFields,
    setFieldArray,
    setGroup,
    getValues,
    validate,
    submit,
  };
};
