import { FieldArrayApiInterface } from '../types';
import { commonApiPure } from './common';
import oGet from 'lodash.get';

export const fieldArrayApiPure = (set, get, path: string): FieldArrayApiInterface => {
  const { setFieldArray, getValues } = commonApiPure(set, get);
  const values = getValues();
  const items = oGet(values, path) || [];

  return {
    addItem(data: any, index?: number): void {
      if (typeof index === 'undefined') {
        setFieldArray(path, [...items, data]);
      } else {
        setFieldArray(path, items.splice(index, 0, data));
      }
    },
    removeItem(index: number): void {
      items.splice(index, 1);
      setFieldArray(path, items);
    },
    moveItem(fromIndex: number, toIndex: number): void {
      const item = items[fromIndex];
      items.splice(fromIndex, 1);
      items.splice(toIndex, 0, item);
      setFieldArray(path, items);
    },
    setItems(items: Array<any>): void {
      setFieldArray(path, items);
    },
    getItems(): Array<any> {
      return items;
    },
  };
};
