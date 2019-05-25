import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ContextApi, ContextForm } from './FormContext';
import Helpers from './Helpers';

class Form extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    defaultValues: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onError: PropTypes.func,
    validation: PropTypes.func,
    errorClass: PropTypes.string,
    invalidClass: PropTypes.string,
    diff: PropTypes.bool,
  };

  static defaultProps = {
    defaultValues: {},
    onError: () => {},
    validation: () => ({}),
    invalidClass: 'is-invalid',
    errorClass: 'invalid-feedback',
    diff: false,
  };

  api = {
    setTouched: (name, callback) => {
      const { validation } = this.props;
      const validators = _.get(validation(this.api), name);
      if (validators && validators.length > 0) {
        this.setState(({ errors, values }) => {
          const value = _.get(values, name);
          _.set(errors, name, this.validateValue(validators, value));
          return {
            errors,
            values,
          };
        }, callback);
      } else if (callback) {
        callback();
      }
    },
    setValue: (name, value, callback) => {
      this.setState(({ errors, values }) => {
        _.set(values, name, value);
        _.set(errors, name, []);
        return {
          values,
          errors,
        };
      }, callback);
    },
    getValue: name => {
      const { values } = this.state;
      return _.get(values, name);
    },
    removeValue: name => {
      const { values } = this.state;
      return _.omit(values, name);
    },
    getErrors: name => {
      const { errors } = this.state;
      return _.get(errors, name);
    },
    setErrors: (name, value, callback) => {
      this.setState(({ errors }) => {
        _.set(errors, name, value);
        return {
          errors,
        };
      }, callback);
    },
    getErrorClass: () => {
      const { errorClass } = this.props;
      return errorClass;
    },
    getInvalidClass: () => {
      const { invalidClass } = this.props;
      return invalidClass;
    },
    getAllValues: () => {
      const { values } = this.state;
      return values;
    },
    getAllErrors: () => {
      const { errors } = this.state;
      return errors;
    },
    setAllErrors: (errors, callback) => {
      this.setState(
        {
          errors,
        },
        callback,
      );
    },
    setAllValues: (values, callback) => {
      this.setState(
        {
          values,
        },
        callback,
      );
    },
    getAllDisabled: () => {
      const { disabled } = this.state;
      return disabled;
    },
    setDisabled: name => {
      const { disabled } = this.state;

      if (!disabled.includes(name)) {
        this.setState({ disabled: [...disabled, name] });
      }
    },
    removeDisabled: name => {
      const { disabled } = this.state;

      if (disabled.includes(name)) {
        const index = disabled.indexOf(name);
        this.setState({ disabled: [...disabled.slice(0, index), ...disabled.slice(index + 1)] });
      }
    },
    isDisabled: name => {
      const { disabled } = this.state;
      return disabled.includes(name);
    },
    submit: () => {
      const { validation, onError, onSubmit, defaultValues, diff } = this.props;
      const { values } = this.state;
      const result = {
        count: 0,
        errors: {},
      };
      this.validateForm(result, validation(this.api));
      this.setState(
        {
          errors: result.errors,
        },
        () => {
          if (result.count && onError) {
            onError(result.errors, this.api);
          } else if (!result.count) {
            const currentValues = diff ? Helpers.getValuesDiff(defaultValues, values) : values;
            onSubmit(_.cloneDeep(currentValues), this.api);
          }
        },
      );
    },
  };

  constructor(props) {
    super(props);
    const { defaultValues } = props;
    this.state = {
      values: _.cloneDeep(defaultValues),
      errors: {},
      disabled: [],
    };
  }

  validateValue = (validators, value) => {
    const errors = [];

    validators.forEach(v => {
      const result = v(value);
      if (result !== true) {
        errors.push(result);
      }
    });

    return errors;
  };

  validateForm = (result, obj, path = []) => {
    Object.keys(obj).forEach(i => {
      const currentPath = [...path, i];
      const validator = obj[i];
      if (Array.isArray(validator)) {
        const value = this.api.getValue(currentPath.join('.'));
        const error = this.validateValue(validator, value);
        if (error && error.length > 0) {
          // eslint-disable-next-line no-param-reassign
          result.count += 1;
          _.set(result.errors, currentPath, error);
        }
      } else if (_.isObject(validator)) {
        this.validateForm(result, validator, currentPath);
      }
    });
  };

  onSubmit = event => {
    if (event) {
      event.preventDefault();
    }
    this.api.submit();
  };

  render() {
    const {
      children,
      defaultValues,
      onSubmit,
      onError,
      validation,
      errorClass,
      invalidClass,
      diff,
      ...props
    } = this.props;
    return (
      <ContextApi.Provider value={this.api}>
        <ContextForm.Provider value={this.state}>
          <form {...props} onSubmit={this.onSubmit}>
            {typeof children === 'function' ? children(this.api) : children}
          </form>
        </ContextForm.Provider>
      </ContextApi.Provider>
    );
  }
}

export default Form;
