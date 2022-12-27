import { FieldArrayApiInterface } from '../types';
import { commonApiPure } from './common';
import oGet from 'lodash.get';
import cloneDeep from 'lodash.clonedeep';

export const fieldArrayApiPure = (set, get, path: string): FieldArrayApiInterface => {
  const { setFieldArray } = commonApiPure(set, get);
  const dynamicValues = cloneDeep(get().dynamicValues);
  const items = oGet(dynamicValues, path) || [];
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
