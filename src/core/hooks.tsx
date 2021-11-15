import { FieldApiInterface, FieldProps, FieldValueType, FormApiInterface, FormStateInterface } from './types';
import { useFormStore } from './api';
import isEqual from 'lodash.isequal';
import { useEffect } from 'react';

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
  props: FieldProps = {},
): [FieldValueType, (value: FieldValueType) => void, FieldApiInterface] => {
  const { autoCreate, disabled, validators } = props;
  const state = useFormStore(selector, compareField(fieldId));
  const fieldApi = state.formApi.getField(
    fieldId,
    typeof autoCreate === 'undefined' ? true : autoCreate,
  ) as FieldApiInterface;
  useEffect(() => {
    fieldApi?.setDisabled(!!disabled);
  }, [disabled]);
  useEffect(() => {
    fieldApi.setValidators(validators || []);
  }, [validators]);
  useEffect(() => {
    return () => {
      fieldApi.setValidators([]);
    };
  }, []);
  return [fieldApi.getValue(), fieldApi.setValue, fieldApi];
};
