import { FieldValueType } from './types';
import isEqual from 'lodash.isequal';
import transform from 'lodash.transform';

export const generateId = () => Math.random().toString(36).substring(2);

export const valueToString = (value: FieldValueType, emptyValue?: any): string => {
  if (typeof value === 'undefined' || value === null || value === emptyValue) {
    return '';
  }
  return value.toString();
};

export const stringToValue = (value: string, emptyValue?: any): string => {
  return value === '' ? emptyValue : value;
};

export const valueToJson = (value: FieldValueType): string => {
  return JSON.stringify({ v: value });
};

export const jsonToValue = (json: string): FieldValueType => {
  const { v } = JSON.parse(json);
  return v;
};

export const getValuesDiff = (prev: any, current: any, maxLevel?: number, currentLevel = 1): any => {
  return transform(current, (result: any, value: any, key: string) => {
    if (prev[key] === undefined) {
      result[key] = value;
    } else if (!isEqual(value, prev[key])) {
      result[key] =
        ((value !== null && typeof value === 'object') || Array.isArray(value)) &&
        (!maxLevel || (maxLevel && currentLevel < maxLevel))
          ? getValuesDiff(prev[key], value, maxLevel, currentLevel + 1)
          : value;
    }
  });
};

export const isPromise = (value: any): boolean => Boolean(value && typeof value?.then === 'function');

export const isArrayHasPromise = (arr: Array<any>): boolean => arr.some((item) => isPromise(item));
