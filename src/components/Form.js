import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ContextApi, ContextForm } from './FormContext';
import _ from 'lodash';

class Form extends Component {

  state = {
    values: _.cloneDeep(this.props.values),
    errors: {},
  };

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
    ]).isRequired,
    values: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onError: PropTypes.func,
    validation: PropTypes.func,
    errorClass: PropTypes.string,
    invalidClass: PropTypes.string,
  };

  static defaultProps = {
    values: {},
    onError: () => {},
    validation: () => ({}),
    invalidClass: 'is-invalid',
    errorClass: 'invalid-feedback',
  };

  api = {
    setValue: (name, value, callback) => {
      this.setState(({ errors, values }) => {
        _.set(values, name, value);
        _.set(errors, name, []);
        return {
          values,
          errors,
        };
      }, () => {
        if (callback) {
          callback();
        }
      });
    },
    setTouched: (name, callback) => {
      const validators = _.get(this.props.validation(this.api), name);
      if (validators && validators.length) {
        this.setState(({ errors, values }) => {
          const value =  _.get(values, name);
          _.set(errors, name, this.validateValue(validators, value));
          return {
            errors,
            values
          };
        }, () => {
          if (callback) {
            callback();
          }
        });
      }
    },
    getValue: (name) => {
      const { values } = this.state;
      return _.get(values, name);
    },
    getErrors: (name) => {
      const { errors } = this.state;
      return _.get(errors, name);
    },
    getErrorClass: () => {
      const { errorClass } = this.props;
      return errorClass;
    },
    getInvalidClass: () => {
      const { invalidClass } = this.props;
      return invalidClass;
    },
  };

  validateValue = (validators, value) => {
    const errors = [];

    validators.forEach((v) => {
      const result = v(value);
      if (result !== true) {
        errors.push(result);
      }
    });

    return errors;
  };

  validateForm = (result, obj, path = []) => {
    Object.keys(obj).forEach((i) => {
      const currentPath = [ ...path, i];
      const validator = obj[i];
      if (Array.isArray(validator)) {
        const value = this.api.getValue(currentPath.join('.'));
        const error = this.validateValue(validator, value);
        if (error && error.length) {
          result.count += 1;
          _.set(result.errors, currentPath, error);
        }
      } else if (_.isObject(validator)) {
        this.validateForm(result, validator, currentPath);
      }
    });
  };

  onSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    const { validation, onError, onSubmit } = this.props;
    const { values } = this.state;
    const result = {
      count: 0,
      errors: {},
    };
    this.validateForm(result, validation(this.api));
    this.setState({
      errors: result.errors,
    }, () => {
      if (result.count && onError) {
        onError(result.errors);
      } else if (!result.count) {
        onSubmit(_.cloneDeep(values));
      }
    });
  };

  render() {
    const { children } = this.props;
    return (
      <ContextApi.Provider value={this.api}>
        <ContextForm.Provider value={this.state}>
          <form onSubmit={this.onSubmit}>
            {typeof children === 'function' ? children(this.api) : children}
          </form>
        </ContextForm.Provider>
      </ContextApi.Provider>
    );
  }
}

export default Form;
