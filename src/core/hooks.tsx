import { FieldApiInterface, FieldValueType, FormApiInterface, FormStateInterface } from './types';
import { useFormStore } from './api';
import isEqual from 'lodash.isequal';

const selector = (state) => state;
const compareState = (oldState: FormStateInterface<any>, newState: FormStateInterface<any>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { formApi: oldFormApi, fields: oldFields, ...oldRest } = oldState;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { formApi: newFormApi, fields: newFields, ...newRest } = newState;
  return isEqual(oldRest, newRest);
};

const compareField = (id: string) => (oldState: FormStateInterface<any>, newState: FormStateInterface<any>) => {
  const oldField = oldState.fields.find((item) => item.id === id);
  const newField = newState.fields.find((item) => item.id === id);
  return isEqual(oldField, newField);
};

export const useForm = <Values,>(): FormApiInterface<Values> => {
  const state = useFormStore((state) => state, compareState);
  return state.formApi;
};

export const useField = (
  fieldId: string,
  autoCreate = true,
): [FieldValueType, (value: FieldValueType) => void, FieldApiInterface] => {
  const state = useFormStore(selector, compareField(fieldId));
  const fieldApi = state.formApi.getField(fieldId, autoCreate) as FieldApiInterface;
  return [fieldApi.getValue(), fieldApi.setValue, fieldApi];
};
