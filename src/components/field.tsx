import React, { Fragment, useContext, useEffect } from 'react';
import { ContextApi, ContextFieldGroup, ContextForm } from './form-context';
import { ValueType } from './validator';
import { ValidationErrorType } from './form';

export interface FieldProps {
  name: string;
  className?: string;
  hideError?: boolean;
  disabled?: boolean;
  validateOnChange?: boolean;
}

export interface FieldPassedProps {
  name: string;
  disabled: boolean;
  className: string;
  getValue: () => ValueType;
  getErrors: () => ValidationErrorType;
  setValue: (value: ValueType, callback?: () => void) => void;
  setTouched: (callback?: () => void) => void;
}

type Diff<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const Field = <P extends FieldProps>(
  PassedComponent: React.ComponentType<P>,
  passedProps: Partial<P & FieldProps> = {} as const,
) => {
  const FieldComponent: React.FC<Diff<Optional<P, keyof typeof passedProps>, FieldPassedProps> & FieldProps> = (
    fieldProps, // Exclude<P, FieldPassedProps> & FieldPassedProps
  ) => {
    const api = useContext(ContextApi);
    const groupName = useContext(ContextFieldGroup);
    useContext(ContextForm);
    if (!api) {
      console.error(
        `Could not found Form API. Make sure <${
          PassedComponent.displayName || PassedComponent.name
        }/> is in the <Form/>.`,
      );
      return null;
    }
    const { name, className, hideError, disabled, validateOnChange, ...props } = { ...fieldProps, ...passedProps };
    useEffect(() => {
      if (groupName) {
        api.addFieldToGroup(groupName, name);
      }
      return () => {
        if (groupName) {
          api.removeFieldFromGroup(groupName, name);
        }
      };
    }, [name]);
    useEffect(() => {
      if (disabled) {
        api.setDisabled(name);
      } else {
        api.removeDisabled(name);
      }
    }, [disabled]);
    const errors = api.getErrors(name);
    const classNames = className ? [className] : [];
    const { invalid: invalidClassName, error: errorClassName } = api.getClasses<'field'>('field');
    if (errors && errors.length > 0 && invalidClassName) {
      classNames.push(invalidClassName);
    }

    return (
      <Fragment>
        <PassedComponent
          {...(props as P)}
          name={name}
          disabled={disabled}
          className={classNames.join(' ')}
          getValue={() => api.getValue(name)}
          getErrors={() => api.getErrors(name)}
          setValue={(value: ValueType, callback?: () => void) => {
            return api.setValue(name, value, () => {
              if (validateOnChange) {
                api.setTouched(name, callback);
              } else if (callback) {
                callback();
              }
            });
          }}
          setTouched={(callback?: () => void) => api.setTouched(name, callback)}
        />
        {!hideError && errors && errors.length > 0 ? (
          <div className={errorClassName}>{Array.isArray(errors) ? errors[0] : errors}</div>
        ) : null}
      </Fragment>
    );
  };

  return FieldComponent;
};
