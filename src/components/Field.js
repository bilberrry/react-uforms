import React, { Fragment } from 'react';
import { ContextApi, ContextForm } from './FormContext';

function Field(PassedComponent, passedProps = {}) {
  return function FieldComponent(fieldProps) {
    return (
      <ContextApi.Consumer>
        {api => (
          <ContextForm.Consumer>
            {() => {
              const {name, className, hideError, ...props} = {...fieldProps, ...passedProps};
              const errors = api.getErrors(name);
              return (
                <Fragment>
                  <PassedComponent
                    {...props}
                    name={name}
                    className={errors && errors.length
                      ? (className ? `${className} ${api.getInvalidClass()}` : api.getInvalidClass())
                      : className}
                    getValue={() => api.getValue(name)}
                    setValue={(value, callback) => api.setValue(name, value, callback)}
                    setTouched={(callback) => api.setTouched(name, callback)}
                  />
                  {!hideError && errors && errors.length
                    ? <div className={api.getErrorClass()}>{typeof errors === "string" ? errors : errors[0]}</div>
                    : null
                  }
                </Fragment>
              );
            }}
          </ContextForm.Consumer>
        )}
      </ContextApi.Consumer>
    );
  };
}

export default Field;
