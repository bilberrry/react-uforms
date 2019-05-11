class Validator {
  static Required = (message = 'Required') => value => {
    if (!(value || value === 0)) {
      return message;
    }

    return true;
  };

  static MinLength = (min, message = `Minimum ${min} characters`) => value => {
    if (value && value.toString().length < min) {
      return message;
    }

    return true;
  };

  static MaxLength = (max, message = `Maximum ${max} characters`) => value => {
    if (value && value.toString().length > max) {
      return message;
    }

    return true;
  };

  static Number = (message = 'Is not a number') => value => {
    if (!/^-{0-1}\d+$/.test(value)) {
      return message;
    }

    return true;
  };

  static Min = (min, message = `Minimum ${min}`) => value => {
    if ((value || value === 0) && parseFloat(value) < min) {
      return message;
    }

    return true;
  };

  static Max = (max, message = `Maximum ${max}`) => value => {
    if ((value || value === 0) && parseFloat(value) > max) {
      return message;
    }

    return true;
  };

  static Range = (range, message = 'Not valid') => value => {
    if ((value || value === 0) && !range.includes(value)) {
      return message;
    }

    return true;
  };

  static Email = (range, message = 'Not valid email address') => value => {
    if (
      (value || value === 0) &&
      // eslint-disable-next-line max-len
      !/^[a-zA-Z0-9!#$%&'*+\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(
        value.toString(),
      )
    ) {
      return message;
    }

    return true;
  };

  static Preg = (regexp, message = 'Not valid') => value => {
    if ((value || value === 0) && !regexp.test(value.toString())) {
      return message;
    }

    return true;
  };
}

export default Validator;
