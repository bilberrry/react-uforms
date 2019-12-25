export type ValueType =
  | boolean
  | number
  | string
  | null
  | {}
  | Array<boolean | number | string | null | {}>
  | undefined;
export type ValidatorInterface = (value: ValueType) => boolean | string;

const isEmpty = (value: ValueType): boolean =>
  // Check if undefined
  typeof value === 'undefined' ||
  // Check if null
  value === null ||
  // Check is empty String
  ((typeof value === 'string' || value instanceof String) && value === '') ||
  // Check if empty Array
  (Array.isArray(value) && value.length === 0) ||
  // Check if empty Object
  (typeof value === 'object' && Object.keys(value).length === 0);

const Required = (message = 'Required'): ValidatorInterface => (value: ValueType) => {
  if (isEmpty(value)) {
    return message;
  }

  return true;
};

const MinLength = (min: number, message = `Minimum ${min} characters`): ValidatorInterface => (value: ValueType) => {
  if (isEmpty(value)) {
    return true;
  }

  if (!(typeof value === 'string' || value instanceof String) || value.toString().length < min) {
    return message;
  }

  return true;
};

const MaxLength = (max: number, message = `Maximum ${max} characters`): ValidatorInterface => (value: ValueType) => {
  if (isEmpty(value)) {
    return true;
  }

  if (!(typeof value === 'string' || value instanceof String) || value.toString().length > max) {
    return message;
  }

  return true;
};

const Numeric = (message = 'Not valid number'): ValidatorInterface => (value: ValueType) => {
  if (isEmpty(value)) {
    return true;
  }

  if (
    !(typeof value === 'string' || value instanceof String || Number(value) === value) ||
    !/^-?\d+(\.\d+)?$/.test(value.toString())
  ) {
    return message;
  }

  return true;
};

const IntegerNumber = (message = 'Not valid integer number'): ValidatorInterface => (value: ValueType) => {
  if (isEmpty(value)) {
    return true;
  }

  if (
    !(typeof value === 'string' || value instanceof String || Number(value) === value) ||
    !/^-?\d+$/.test(value.toString())
  ) {
    return message;
  }

  return true;
};

const FloatNumber = (message = 'Not valid float number'): ValidatorInterface => (value: ValueType) => {
  if (isEmpty(value)) {
    return true;
  }

  if (
    !(typeof value === 'string' || value instanceof String || Number(value) === value) ||
    !/^-?\d+\.\d+$/.test(value.toString())
  ) {
    return message;
  }

  return true;
};

const Min = (min: number, message = `Minimum ${min}`): ValidatorInterface => (value: ValueType) => {
  if (isEmpty(value)) {
    return true;
  }

  if (
    !(typeof value === 'string' || value instanceof String || Number(value) === value) ||
    !/^-?\d+(\.\d+)?$/.test(value.toString()) ||
    parseFloat(value.toString()) < min
  ) {
    return message;
  }

  return true;
};

const Max = (max: number, message = `Maximum ${max}`): ValidatorInterface => (value: ValueType) => {
  if (isEmpty(value)) {
    return true;
  }

  if (
    !(typeof value === 'string' || value instanceof String || Number(value) === value) ||
    !/^-?\d+(\.\d+)?$/.test(value.toString()) ||
    parseFloat(value.toString()) > max
  ) {
    return message;
  }

  return true;
};

const Range = (range: Array<any>, message = 'Not valid'): ValidatorInterface => (value: ValueType) => {
  if (isEmpty(value)) {
    return true;
  }

  if (!range.includes(value)) {
    return message;
  }

  return true;
};

const Email = (message = 'Not valid email address'): ValidatorInterface => (value: ValueType) => {
  if (isEmpty(value)) {
    return true;
  }

  if (
    !(typeof value === 'string' || value instanceof String) ||
    // RFC 5322
    // eslint-disable-next-line max-len
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      value.toString(),
    )
  ) {
    return message;
  }

  return true;
};

const Preg = (regexp: RegExp, message = 'Not valid'): ValidatorInterface => (value: ValueType) => {
  if (isEmpty(value)) {
    return true;
  }

  if (!(typeof value === 'string' || value instanceof String) || !regexp.test(value.toString())) {
    return message;
  }

  return true;
};

export { Required, MinLength, MaxLength, Numeric, IntegerNumber, FloatNumber, Min, Max, Range, Email, Preg };
