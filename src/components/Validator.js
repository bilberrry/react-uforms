const isEmpty = value =>
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

const Required = (message = 'Required') => value => {
  if (isEmpty(value)) {
    return message;
  }

  return true;
};

const MinLength = (min, message = `Minimum ${min} characters`) => value => {
  if (isEmpty(value)) {
    return true;
  }

  if (!(typeof value === 'string' || value instanceof String) || value.toString().length < min) {
    return message;
  }

  return true;
};

const MaxLength = (max, message = `Maximum ${max} characters`) => value => {
  if (isEmpty(value)) {
    return true;
  }

  if (!(typeof value === 'string' || value instanceof String) || value.toString().length > max) {
    return message;
  }

  return true;
};

const Numeric = (message = 'Not valid number') => value => {
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

const IntegerNumber = (message = 'Not valid integer number') => value => {
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

const FloatNumber = (message = 'Not valid float number') => value => {
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

const Min = (min, message = `Minimum ${min}`) => value => {
  if (isEmpty(value)) {
    return true;
  }

  if (
    !(typeof value === 'string' || value instanceof String || Number(value) === value) ||
    !/^-?\d+(\.\d+)?$/.test(value.toString()) ||
    parseFloat(value) < min
  ) {
    return message;
  }

  return true;
};

const Max = (max, message = `Maximum ${max}`) => value => {
  if (isEmpty(value)) {
    return true;
  }

  if (
    !(typeof value === 'string' || value instanceof String || Number(value) === value) ||
    !/^-?\d+(\.\d+)?$/.test(value.toString()) ||
    parseFloat(value) > max
  ) {
    return message;
  }

  return true;
};

const Range = (range, message = 'Not valid') => value => {
  if (isEmpty(value)) {
    return true;
  }

  if (!range.includes(value)) {
    return message;
  }

  return true;
};

const Email = (message = 'Not valid email address') => value => {
  if (isEmpty(value)) {
    return true;
  }

  if (
    !(typeof value === 'string' || value instanceof String) ||
    // RFC 5322
    // eslint-disable-next-line max-len
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      value,
    )
  ) {
    return message;
  }

  return true;
};

const Preg = (regexp, message = 'Not valid') => value => {
  if (isEmpty(value)) {
    return true;
  }

  if (!(typeof value === 'string' || value instanceof String) || !regexp.test(value)) {
    return message;
  }

  return true;
};

export default { Required, MinLength, MaxLength, Numeric, IntegerNumber, FloatNumber, Min, Max, Range, Email, Preg };
