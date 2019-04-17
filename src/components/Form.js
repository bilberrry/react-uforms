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
    isUpdatesOnly: PropTypes.bool,
  };

  static defaultProps = {
    values: {},
    onError: () => {},
    validation: () => ({}),
    invalidClass: 'is-invalid',
    errorClass: 'invalid-feedback',
    isUpdatesOnly: false,
  };

  static getValuesDifference(prev, current) {
    function changes(prev, current) {
      return _.transform(current, function(result, value, key) {
        if (_.isUndefined(prev[key])){
          result[key] = value;
        } else {
          if (!_.isEqual(value, prev[key])) {
            result[key] = _.isObject(value) || _.isArray(value) ? changes(value, prev[key]) : value;
          }
        }
      });
    }
    return changes(prev, current);
  }

  api = {
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
    getValue: (name) => {
      const { values } = this.state;
      return _.get(values, name);
    },
    getErrors: (name) => {
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
      this.setState({
        errors
      }, callback);
    },
    setAllValues: (values, callback) => {
      this.setState({
        values
      }, callback);
    }
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
    const { validation, onError, onSubmit, values: prevValues, isUpdatesOnly } = this.props;
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
        onError(result.errors, this.api);
      } else if (!result.count) {
        const currentValues = isUpdatesOnly ? Form.getValuesDifference(prevValues, values): values;
        onSubmit(_.cloneDeep(currentValues), this.api);
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
