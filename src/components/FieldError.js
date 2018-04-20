import React, { Component } from 'react';
import { ContextApi, ContextErrors } from './FormContext';
import PropTypes from "prop-types";

class FieldError extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  render() {
    const {
      name,
      className,
      ...props
    } = this.props;

    return (
      <ContextApi.Consumer>
        {api => (
          <ContextErrors.Consumer>
            {() => {
              const errors = api.getErrors(name);
              return errors && errors.length
                ? (
                  <div
                    {...props}
                    className={className
                      ? `${className} ${api.getErrorClass()}`
                      : api.getErrorClass()}
                  >
                    {errors[0]}
                  </div>
                )
                : null
            }}
          </ContextErrors.Consumer>
        )}
      </ContextApi.Consumer>
    );
  }
}

export default FieldError;
