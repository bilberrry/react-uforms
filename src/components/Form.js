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
    isUpdatesOnly: PropTypes.bool,
  };

  static defaultProps = {
    defaultValues: {},
    onError: () => {},
    validation: () => ({}),
    invalidClass: 'is-invalid',
    errorClass: 'invalid-feedback',
    isUpdatesOnly: false,
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
    getAllDisabledFields: () => {
      const { disabledFields } = this.state;
      return disabledFields;
    },
    setDisabledField: name => {
      const { disabledFields } = this.state;

      if (!disabledFields.includes(name)) {
        this.setState({ disabledFields: [...disabledFields, name] });
      }
    },
    removeDisabledField: name => {
      const { disabledFields } = this.state;

      if (disabledFields.includes(name)) {
        const index = disabledFields.indexOf(name);
        this.setState({ disabledFields: [...disabledFields.slice(0, index), ...disabledFields.slice(index + 1)] });
      }
    },
  };

  constructor(props) {
    super(props);
    const { defaultValues } = props;
    this.state = {
      values: _.cloneDeep(defaultValues),
      errors: {},
      disabledFields: [],
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
    const { validation, onError, onSubmit, defaultValues, isUpdatesOnly } = this.props;
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
          const currentValues = isUpdatesOnly ? Helpers.getValuesDiff(defaultValues, values) : values;
          onSubmit(_.cloneDeep(currentValues), this.api);
        }
      },
    );
  };

  render() {
    const { children } = this.props;
    return (
      <ContextApi.Provider value={this.api}>
        <ContextForm.Provider value={this.state}>
          <form onSubmit={this.onSubmit}>{typeof children === 'function' ? children(this.api) : children}</form>
        </ContextForm.Provider>
      </ContextApi.Provider>
    );
  }
}

export default Form;
