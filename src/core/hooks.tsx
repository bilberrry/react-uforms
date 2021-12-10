import {
  ArrFieldApiInterface,
  FieldApiInterface,
  FieldErrorsType,
  FieldValueType,
  FormApiInterface,
  FormStateInterface,
  GroupApiInterface,
  GroupInterface,
  GroupsApiInterface,
  UseFieldProps,
  UseGroupProps,
} from './types';
import { useFormStore } from './store';
import isEqual from 'lodash.isequal';
import { useEffect } from 'react';
import { GroupState, useGroupStore } from './components/extra/group';
import oGet from 'lodash.get';

const selector = (state) => state;
const compareForm = (oldState: FormStateInterface<any>, newState: FormStateInterface<any>) => {
  return isEqual(oldState.form, newState.form);
};

const compareField = (ids: Array<string>) => (oldState: FormStateInterface<any>, newState: FormStateInterface<any>) => {
  const oldField = oldState.fields.filter((item) => ids.indexOf(item.id) > -1);
  const newField = newState.fields.filter((item) => ids.indexOf(item.id) > -1);
  return isEqual(oldField, newField);
};

const compareArrField =
  (ids: Array<string>) => (oldState: FormStateInterface<any>, newState: FormStateInterface<any>) => {
    const oldField = oldState.arrFields.filter((item) => ids.indexOf(item.id) > -1);
    const newField = newState.arrFields.filter((item) => ids.indexOf(item.id) > -1);
    return isEqual(oldField, newField);
  };

const compareGroup = (name: string) => (oldState: FormStateInterface<any>, newState: FormStateInterface<any>) => {
  const oldGroup = oldState.groups.find((item) => item.name === name);
  const newGroup = newState.groups.find((item) => item.name === name);
  return isEqual(oldGroup, newGroup);
};

const compareGroups = () => (oldState: FormStateInterface<any>, newState: FormStateInterface<any>) => {
  return isEqual(oldState.groups, newState.groups);
};

const compareFieldValue = (id: string) => (oldState: FormStateInterface<any>, newState: FormStateInterface<any>) => {
  const oldField = oldState.fields.find((item) => item.id === id);
  const newField = newState.fields.find((item) => item.id === id);
  return oldField?.value === newField?.value;
};

const compareFieldError = (id: string) => (oldState: FormStateInterface<any>, newState: FormStateInterface<any>) => {
  const oldField = oldState.fields.find((item) => item.id === id);
  const newField = newState.fields.find((item) => item.id === id);
  return oldField?.errors.length === newField?.errors.length;
};

export const useForm = <Values,>(): FormApiInterface<Values> => {
  const state = useFormStore((state) => state, compareForm);
  return state.formApi;
};

export const useField = <Values,>(
  fieldId: string,
  props: UseFieldProps = {},
): [FieldValueType, (value: FieldValueType) => void, FieldApiInterface, FormApiInterface<Values>] => {
  const { autoCreate, disabled, dependsOn } = props;
  const state = useFormStore(selector, compareField([fieldId, ...(dependsOn || [])]));
  let group: undefined | GroupState = undefined;
  try {
    group = useGroupStore();
  } catch (e) {}

  const formApi = state.formApi as FormApiInterface<Values>;
  const fieldApi = formApi.getField(
    fieldId,
    typeof autoCreate === 'undefined' ? true : autoCreate,
  ) as FieldApiInterface;
  useEffect(() => {
    fieldApi.setDisabled(!!disabled);
  }, [disabled]);
  useEffect(() => {
    fieldApi.setGroup(group ? group.name : null);
  }, [group]);
  useEffect(() => {
    return () => {
      fieldApi.remove();
    };
  }, []);
  return [fieldApi.getValue(), fieldApi.setValue, fieldApi, formApi];
};

export const useGroup = <Values,>(
  groupName: string,
  props: UseGroupProps = {},
): [GroupApiInterface, GroupsApiInterface, FormApiInterface<Values>] => {
  const { defaultActive, autoCreate } = props;
  const state = useFormStore(selector, compareGroup(groupName));
  const formApi = state.formApi as FormApiInterface<Values>;
  const groupsApi = formApi.groupsApi;
  const groupApi = formApi.groupsApi.getGroup(groupName, typeof autoCreate === 'undefined' ? true : autoCreate, {
    isActive: !!defaultActive,
  }) as GroupApiInterface;
  useEffect(() => {
    return () => {
      groupApi.remove();
    };
  }, []);
  return [groupApi, groupsApi, formApi];
};

export const useGroups = <Values,>(): [Array<GroupInterface>, GroupsApiInterface, FormApiInterface<Values>] => {
  const state = useFormStore(selector, compareGroups()) as FormStateInterface<Values>;
  return [state.groups, state.formApi.groupsApi, state.formApi];
};

export const useFieldValue = (fieldId: string): [FieldValueType | undefined, string | undefined] => {
  const state = useFormStore(selector, compareFieldValue(fieldId));
  const fieldApi = state.formApi.getField(fieldId, false) as FieldApiInterface;
  return fieldApi ? [fieldApi.getValue(), fieldApi.getInputClassName()] : [undefined, undefined];
};

export const useFieldErrors = (fieldId: string): [FieldErrorsType | undefined, string | undefined] => {
  const state = useFormStore(selector, compareFieldError(fieldId));
  const fieldApi = state.formApi.getField(fieldId, false) as FieldApiInterface;
  return fieldApi ? [fieldApi.getErrors(), fieldApi.getErrorClassName()] : [undefined, undefined];
};

export const useArrField = <Values,>(
  arrFieldId: string,
): [items: Array<string>, arrFieldApi: ArrFieldApiInterface, formApi: FormApiInterface<Values>] => {
  const state = useFormStore((state) => state, compareArrField([arrFieldId]));
  const formApi = state.formApi as FormApiInterface<Values>;
  const arrFieldApi = formApi.getArrField(arrFieldId, true) as ArrFieldApiInterface;

  useEffect(() => {
    const defaultValues = state.formApi.getDefaultValues();
    const arr = oGet(defaultValues, arrFieldId);
    if (Array.isArray(arr) && arr.length > 0) {
      const items = arr.map((e, i) => `${arrFieldId}.${i}`);
      arrFieldApi.setItems(items);
    }
  }, [arrFieldId, state.formApi.getDefaultValues()]);

  useEffect(() => {
    return () => {
      arrFieldApi.remove();
    };
  }, []);

  return [arrFieldApi.getItems(), arrFieldApi, formApi];
};
