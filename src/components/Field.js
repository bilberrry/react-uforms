import React, { Fragment } from 'react';
import { ContextApi, ContextForm } from './FormContext';

const Field = (PassedComponent, passedProps = {}) =>
  function FieldComponent(fieldProps) {
    return (
      <ContextApi.Consumer>
        {api => (
          <ContextForm.Consumer>
            {() => {
              const { name, className, hideError, disabled, ...props } = { ...fieldProps, ...passedProps };
              const errors = api.getErrors(name);
              const classNames = className ? [className] : [];
              if (errors && errors.length > 0) {
                classNames.push(api.getInvalidClass());
              }
              if (disabled) {
                api.setDisabled(name);
              } else {
                api.removeDisabled(name);
              }

              return (
                <Fragment>
                  <PassedComponent
                    {...props}
                    name={name}
                    disabled={disabled}
                    className={classNames.join(' ')}
                    getValue={() => api.getValue(name)}
                    setValue={(value, callback) => api.setValue(name, value, callback)}
                    setTouched={callback => api.setTouched(name, callback)}
                  />
                  {!hideError && errors && errors.length > 0 ? (
                    <div className={api.getErrorClass()}>{typeof errors === 'string' ? errors : errors[0]}</div>
                  ) : null}
                </Fragment>
              );
            }}
          </ContextForm.Consumer>
        )}
      </ContextApi.Consumer>
    );
  };

export default Field;
