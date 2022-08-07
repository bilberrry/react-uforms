import { ValueType } from './validator';
import transform from 'lodash.transform';
import isEqual from 'lodash.isequal';;

export const valueToString = (value: ValueType): string => {
  if (typeof value === 'string' || value instanceof String) {
    return value.toString();
  }
  if (typeof value === 'number') {
    return `${value}`;
  }

  return '';
};

export const valueToJson = (value: ValueType): string => {
  return JSON.stringify({ v: value });
};

export const jsonToValue = (json: string): ValueType => {
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
