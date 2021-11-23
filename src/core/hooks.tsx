import {
  FieldApiInterface,
  FieldErrorsType,
  FieldProps,
  FieldValueType,
  FormApiInterface,
  FormStateInterface,
  GroupApiInterface,
  GroupInterface,
  GroupProps,
} from './types';
import { useFormStore } from './api';
import isEqual from 'lodash.isequal';
import { useEffect } from 'react';
import { GroupState, useGroupStore } from './components/group';

const selector = (state) => state;
const compareState = (oldState: FormStateInterface<any>, newState: FormStateInterface<any>) => {
  return isEqual(oldState.form, newState.form);
};

const compareField = (id: string) => (oldState: FormStateInterface<any>, newState: FormStateInterface<any>) => {
  const oldField = oldState.fields.find((item) => item.id === id);
  const newField = newState.fields.find((item) => item.id === id);
  return isEqual(oldField, newField);
};

const compareGroup = (name: string) => (oldState: FormStateInterface<any>, newState: FormStateInterface<any>) => {
  const oldGroup = oldState.groups.find((item) => item.name === name);
  const newGroup = newState.groups.find((item) => item.name === name);
  return isEqual(oldGroup, newGroup);
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
  const state = useFormStore((state) => state, compareState);
  return state.formApi;
};

export const useField = (
  fieldId: string,
  props: FieldProps = {},
): [FieldValueType, (value: FieldValueType) => void, FieldApiInterface] => {
  const { autoCreate, disabled, validators } = props;
  const state = useFormStore(selector, compareField(fieldId));
  let group: undefined | GroupState = undefined;
  try {
    group = useGroupStore();
  } catch (e) {}

  const fieldApi = state.formApi.getField(
    fieldId,
    typeof autoCreate === 'undefined' ? true : autoCreate,
  ) as FieldApiInterface;
  useEffect(() => {
    fieldApi.setDisabled(!!disabled);
  }, [disabled]);
  useEffect(() => {
    fieldApi.setValidators(validators || []);
    return () => {
      fieldApi.setValidators([]);
    };
  }, [validators]);
  useEffect(() => {
    fieldApi.setGroup(group ? group.name : null);
  }, [group]);
  return [fieldApi.getValue(), fieldApi.setValue, fieldApi];
};

export const useGroup = (groupName: string, props: GroupProps = {}): [GroupInterface, GroupApiInterface] => {
  const { defaultActive, autoCreate } = props;
  const state = useFormStore(selector, compareGroup(groupName));
  const groupApi = state.formApi.getGroup(groupName, typeof autoCreate === 'undefined' ? true : autoCreate, {
    isActive: defaultActive,
  }) as GroupApiInterface;
  useEffect(() => {
    return () => {
      groupApi.remove();
    };
  }, []);
  return [groupApi.getObject(), groupApi];
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
