class Validator {
  static Required = (message = 'Required') => value => {
    if (
      !(value || value === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return message;
    }

    return true;
  };

  static MinLength = (min, message = `Minimum ${min} characters`) => value => {
    if (!(typeof value === 'string' || value instanceof String) || value.toString().length < min) {
      return message;
    }

    return true;
  };

  static MaxLength = (max, message = `Maximum ${max} characters`) => value => {
    if (!(typeof value === 'string' || value instanceof String) || value.toString().length > max) {
      return message;
    }

    return true;
  };

  static Number = (message = 'Not valid number') => value => {
    if (
      !(typeof value === 'string' || value instanceof String || Number(value) === value) ||
      !/^-?\d+(\.\d+)?$/.test(value.toString())
    ) {
      return message;
    }

    return true;
  };

  static IntegerNumber = (message = 'Not valid integer number') => value => {
    if (
      !(typeof value === 'string' || value instanceof String || Number(value) === value) ||
      !/^-?\d+$/.test(value.toString())
    ) {
      return message;
    }

    return true;
  };

  static FloatNumber = (message = 'Not valid float number') => value => {
    if (
      !(typeof value === 'string' || value instanceof String || Number(value) === value) ||
      !/^-?\d+\.\d+$/.test(value.toString())
    ) {
      return message;
    }

    return true;
  };

  static Min = (min, message = `Minimum ${min}`) => value => {
    if (
      !(typeof value === 'string' || value instanceof String || Number(value) === value) ||
      !/^-?\d+(\.\d+)?$/.test(value.toString()) ||
      parseFloat(value) < min
    ) {
      return message;
    }

    return true;
  };

  static Max = (max, message = `Maximum ${max}`) => value => {
    if (
      !(typeof value === 'string' || value instanceof String || Number(value) === value) ||
      !/^-?\d+(\.\d+)?$/.test(value.toString()) ||
      parseFloat(value) > max
    ) {
      return message;
    }

    return true;
  };

  static Range = (range, message = 'Not valid') => value => {
    if (!range.includes(value)) {
      return message;
    }

    return true;
  };

  static Email = (message = 'Not valid email address') => value => {
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

  static Preg = (regexp, message = 'Not valid') => value => {
    if (!(typeof value === 'string' || value instanceof String) || !regexp.test(value)) {
      return message;
    }

    return true;
  };
}

export default Validator;
