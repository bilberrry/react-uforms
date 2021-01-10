import React from 'react';
import { ContextApi, ContextForm } from './form-context';

const FieldErrorComponent: React.FC<{
  name: string;
  className?: string;
  [key: string]: any;
}> = ({ name, className, ...props }) => (
  <ContextApi.Consumer>
    {(api) => (
      <ContextForm.Consumer>
        {() => {
          if (!api) {
            console.error('Could not found Form API. Make sure <FieldError/> is in the <Form/>.');
            return null;
          }
          const errors = api.getErrors(name);
          const classNames = className ? [className] : [];
          const { error: errorClassName } = api.getClasses<'field'>('field');
          if (errorClassName) {
            classNames.push(errorClassName);
          }
          return errors && errors.length > 0 ? (
            <div {...props} className={classNames.join(' ')}>
              {Array.isArray(errors) ? errors[0] : errors}
            </div>
          ) : null;
        }}
      </ContextForm.Consumer>
    )}
  </ContextApi.Consumer>
);

FieldErrorComponent.displayName = 'FieldError';

export const FieldError = FieldErrorComponent;
