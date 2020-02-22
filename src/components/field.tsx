import React, { Fragment } from 'react';
import { ContextApi, ContextForm } from './form-context';
import { ValueType } from './validator';

export interface FieldProps {
  name: string;
  className?: string;
  hideError?: boolean;
  disabled?: boolean;
}

export interface FieldPassedProps {
  name: string;
  disabled: boolean;
  className: string;
  getValue: () => ValueType;
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
  ) => (
    <ContextApi.Consumer>
      {api => (
        <ContextForm.Consumer>
          {() => {
            const { name, className, hideError, disabled, ...props } = { ...fieldProps, ...passedProps };
            if (!api) {
              console.error(
                `Could not found Form API. Make sure <${PassedComponent.displayName ||
                  PassedComponent.name}/> is in the <Form/>.`,
              );
              return null;
            }
            const errors = api.getErrors(name);
            const classNames = className ? [className] : [];
            const errorClassName = api.getInvalidClass();
            if (errors && errors.length > 0 && errorClassName) {
              classNames.push(errorClassName);
            }
            if (disabled) {
              api.setDisabled(name);
            } else {
              api.removeDisabled(name);
            }

            return (
              <Fragment>
                <PassedComponent
                  {...(props as P)}
                  name={name}
                  disabled={disabled}
                  className={classNames.join(' ')}
                  getValue={() => api.getValue(name)}
                  setValue={(value: ValueType, callback?: () => void) => api.setValue(name, value, callback)}
                  setTouched={(callback?: () => void) => api.setTouched(name, callback)}
                />
                {!hideError && errors && errors.length > 0 ? (
                  <div className={api.getErrorClass()}>{Array.isArray(errors) ? errors[0] : errors}</div>
                ) : null}
              </Fragment>
            );
          }}
        </ContextForm.Consumer>
      )}
    </ContextApi.Consumer>
  );

  return FieldComponent;
};
