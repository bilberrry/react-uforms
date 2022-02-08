import {
  FieldApiInterface,
  FieldArrayApiInterface,
  FieldErrorsType,
  FieldValueType,
  FormApiInterface,
  FormStateInterface,
  FormValues,
  GroupApiInterface,
  GroupInterface,
  GroupsApiInterface,
  NestedKeys,
  UseFieldProps,
  UseGroupProps,
} from './types';
import { useFormStore } from './store';
import isEqual from 'lodash.isequal';
import { useEffect } from 'react';
import { GroupState, useGroupStore } from './components/extra/group';
import oGet from 'lodash.get';

const selector = (state) => state;
const compareForm = <Values extends FormValues>(
  oldState: FormStateInterface<Values>,
  newState: FormStateInterface<Values>,
) => {
  return isEqual(oldState.form, newState.form);
};

const compareField =
  <Values extends FormValues>(ids: Array<string>) =>
  (oldState: FormStateInterface<Values>, newState: FormStateInterface<Values>) => {
    const oldField = oldState.fields.filter((item) => ids.indexOf(item.id) > -1);
    const newField = newState.fields.filter((item) => ids.indexOf(item.id) > -1);
    return isEqual(oldField, newField);
  };

const compareGroup =
  <Values extends FormValues>(name: string) =>
  (oldState: FormStateInterface<Values>, newState: FormStateInterface<Values>) => {
    const oldGroup = oldState.groups.find((item) => item.name === name);
    const newGroup = newState.groups.find((item) => item.name === name);
    return isEqual(oldGroup, newGroup);
  };

const compareGroups =
  <Values extends FormValues>() =>
  (oldState: FormStateInterface<Values>, newState: FormStateInterface<Values>) => {
    return isEqual(oldState.groups, newState.groups);
  };

const compareFieldValue =
  <Values extends FormValues>(id: string) =>
  (oldState: FormStateInterface<Values>, newState: FormStateInterface<Values>) => {
    const oldField = oldState.fields.find((item) => item.id === id);
    const newField = newState.fields.find((item) => item.id === id);
    return oldField?.value === newField?.value;
  };

const compareFieldError =
  <Values extends FormValues>(id: string) =>
  (oldState: FormStateInterface<Values>, newState: FormStateInterface<Values>) => {
    const oldField = oldState.fields.find((item) => item.id === id);
    const newField = newState.fields.find((item) => item.id === id);
    return oldField?.errors.length === newField?.errors.length;
  };

const compareDynamicValues =
  <Values extends FormValues>(path: string) =>
  (oldState: FormStateInterface<Values>, newState: FormStateInterface<Values>) => {
    const oldValue = oGet(oldState.dynamicValues, path);
    const newValue = oGet(newState.dynamicValues, path);
    return isEqual(oldValue, newValue);
  };

export const useForm = <Values extends FormValues>(): FormApiInterface<Values> => {
  const state = useFormStore((state) => state, compareForm) as unknown as FormStateInterface<Values>;
  return state.formApi;
};

export const useField = <Values extends FormValues>(
  fieldId: NestedKeys<Values>,
  props: UseFieldProps = {},
): [FieldValueType, (value: FieldValueType) => void, FieldApiInterface, FormApiInterface<Values>] => {
  const { autoCreate, disabled, dependsOn } = props;
  const state = useFormStore(
    selector,
    compareField([fieldId, ...(dependsOn || [])]),
  ) as unknown as FormStateInterface<Values>;
  let group: undefined | GroupState = undefined;
  try {
    group = useGroupStore();
  } catch (e) {}

  const formApi = state.formApi as unknown as FormApiInterface<Values>;
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
  }, [fieldId]);
  return [fieldApi.getValue(), fieldApi.setValue, fieldApi, formApi];
};

export const useGroup = <Values extends FormValues>(
  groupName: string,
  props: UseGroupProps = {},
): [GroupApiInterface, GroupsApiInterface, FormApiInterface<Values>] => {
  const { defaultActive, autoCreate } = props;
  const state = useFormStore(selector, compareGroup(groupName)) as unknown as FormStateInterface<Values>;
  const formApi = state.formApi;
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

export const useGroups = <Values extends FormValues>(): [
  Array<GroupInterface>,
  GroupsApiInterface,
  FormApiInterface<Values>,
] => {
  const state = useFormStore(selector, compareGroups()) as unknown as FormStateInterface<Values>;
  return [state.groups, state.formApi.groupsApi, state.formApi];
};

export const useFieldValues = <Values extends FormValues>(
  fieldIds: Array<NestedKeys<Values>>,
): Array<FieldValueType> => {
  const state = useFormStore(selector, compareField(fieldIds)) as unknown as FormStateInterface<Values>;
  return fieldIds.map((fieldId) => {
    const fieldApi = state.formApi.getField(fieldId, false);
    return fieldApi ? fieldApi.getValue() : undefined;
  });
};

export const useFieldValue = <Values extends FormValues>(
  fieldId: NestedKeys<Values>,
): [FieldValueType | undefined, string | undefined] => {
  const state = useFormStore(selector, compareFieldValue(fieldId)) as unknown as FormStateInterface<Values>;
  const fieldApi = state.formApi.getField(fieldId, false) as FieldApiInterface;
  return fieldApi ? [fieldApi.getValue(), fieldApi.getInputClassName()] : [undefined, undefined];
};

export const useFieldErrors = <Values extends FormValues>(
  fieldId: NestedKeys<Values>,
): [FieldErrorsType | undefined, string | undefined] => {
  const state = useFormStore(selector, compareFieldError(fieldId)) as unknown as FormStateInterface<Values>;
  const fieldApi = state.formApi.getField(fieldId, false);
  return fieldApi ? [fieldApi.getErrors(), fieldApi.getErrorClassName()] : [undefined, undefined];
};

export const useFieldArray = <Values extends FormValues>(
  fieldArrayId: string,
): [items: Array<string>, fieldArrayApi: FieldArrayApiInterface, formApi: FormApiInterface<Values>] => {
  const state = useFormStore(
    (state) => state,
    compareDynamicValues(fieldArrayId),
  ) as unknown as FormStateInterface<Values>;
  const formApi = state.formApi;
  const fieldArrayApi = formApi.getFieldArray(fieldArrayId) as FieldArrayApiInterface;

  return [fieldArrayApi.getItems(), fieldArrayApi, formApi];
};
