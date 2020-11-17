import { useState, useEffect } from 'react';
import { generateId } from './helpers';
import { useFieldApi } from './api';

export const useSetFieldValue = (fieldId: string): ((value: any) => void) => {
  const field = useFieldApi(fieldId);
  const setValue = (value: any) => {
    field.setValue(value);
  };
  useEffect(() => {
    const setterId = generateId();
    field.mountSetter(setterId);
    return () => {
      field.unmountSetter(setterId);
    };
  }, [fieldId]);

  return setValue;
};

export const useFieldValue = (fieldId: string): any => {
  const field = useFieldApi(fieldId);
  const [value, setValue] = useState('');
  useEffect(() => {
    const getterId = generateId();
    function handleChangeValue(newValue: any) {
      setValue(newValue);
    }
    field.mountGetter(getterId, handleChangeValue);
    return () => {
      field.unmountGetter(getterId);
    };
  }, [fieldId]);

  return value;
};

export const useField = (fieldId: string): [any, (value: any) => void] => {
  const setValue = useSetFieldValue(fieldId);
  const value = useFieldValue(fieldId);

  return [value, setValue];
};
