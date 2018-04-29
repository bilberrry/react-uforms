import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ContextApi, ContextValues, ContextErrors } from './FormContext';
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

  static componentWillReceiveProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.values, prevState.values)) { // JSON.stringify(nextProps.values) !== JSON.stringify(prevState.values)
      return { values: _.cloneDeep(nextProps.values), errors: [] };
    }

    return null;
  }

  api = {
    setValue: (name, value) => {
      const errors = { ...this.state.errors };
      const values = { ...this.state.values };
      _.set(values, name, value);
      _.set(errors, name, []);
      this.setState({
        values,
        errors,
      });
    },
    setTouched: (name) => {
      const { values } = this.state;
      const errors = { ...this.state.errors };
      const validators = _.get(this.props.validation(this.api), name);
      if (validators && validators.length) {
        const value =  _.get(values, name);
        _.set(errors, name, this.validateValue(validators, value));
        this.setState({
          errors,
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
    event.preventDefault();
    const { validation, onError, onSubmit } = this.props;
    const { values } = this.state;
    const result = {
      count: 0,
      errors: {},
    };
    this.validateForm(result, validation(this.api));
    this.setState({
      errors: result.errors,
    });
    if (result.count && onError) {
      onError(result.errors);
    } else if (!result.count) {
      onSubmit(_.cloneDeep(values));
    }
  };

  render() {
    const { children } = this.props;
    return (
      <ContextApi.Provider value={this.api}>
        <ContextValues.Provider value={this.state.values}>
          <ContextErrors.Provider value={this.state.errors}>
            <form onSubmit={this.onSubmit}>
              {typeof children === 'function' ? children(this.api) : children}
            </form>
          </ContextErrors.Provider>
        </ContextValues.Provider>
      </ContextApi.Provider>
    );
  }
}

export default Form;
