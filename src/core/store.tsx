import { create } from 'zustand';
import createContext from 'zustand/context';
import {
  FieldApiInterface,
  FieldArrayApiInterface,
  FieldInterface,
  FormStateInterface,
  FormValues,
  GroupApiInterface,
  GroupInterface,
} from './types';
import { defaultClasses } from './components/form-provider';
import oGet from 'lodash.get';
import { groupApiPure } from './apis/group';
import { formApiPure } from './apis/form';
import { fieldApiPure } from './apis/field';
import { fieldArrayApiPure } from './apis/field-array';

export const { Provider: FormStoreProvider, useStore: useFormStore } = createContext<any>();

export const createFormStore = <Values extends FormValues>() =>
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
          value: oGet(get().dynamicValues, fieldId),
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
    const getFieldArray = (fieldArrayId: string): FieldArrayApiInterface | undefined => {
      return fieldArrayApiPure(set, get, fieldArrayId);
    };

    const formApi = formApiPure<Values>(set, get, getField, getGroup, getFieldArray);

    return {
      form: {
        defaultValues: {},
        isStripUnknown: false,
        isValidating: false,
        isTouched: false,
        isValid: true,
        isChanged: false,
        formRef: null,
        validation: {},
        classes: defaultClasses,
      },
      dynamicValues: {},
      fields: [],
      groups: [],
      formApi,
    };
  });
