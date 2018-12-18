import React, { Fragment } from 'react';
import { ContextApi, ContextValues, ContextErrors } from './FormContext';

function Field(PassedComponent, passedProps = {}) {
  return function FieldComponent(fieldProps) {
    return (
      <ContextApi.Consumer>
        {api => (
          <ContextValues.Consumer>
            {() => (
              <ContextErrors.Consumer>
                {() => {
                  const { name, className, hideError, ...props } = { ...fieldProps, ...passedProps };
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
                        ? <div className={api.getErrorClass()}>{errors[0]}</div>
                        : null
                      }
                    </Fragment>
                  );
                }}
              </ContextErrors.Consumer>
            )}
          </ContextValues.Consumer>
        )}
      </ContextApi.Consumer>
    );
  };
}

export default Field;
