import React from 'react';
import { ContextApi, ContextForm } from './form-context';

const FieldError: React.FC<{
  name: string;
  className?: string;
  [key: string]: any;
}> = ({ name, className, ...props }) => (
  <ContextApi.Consumer>
    {api => (
      <ContextForm.Consumer>
        {() => {
          if (!api) {
            console.error('Could not found Form API. Make sure <FieldError/> is in the <Form/>.');
            return null;
          }
          const errors = api.getErrors(name);
          return errors && errors.length > 0 ? (
            <div {...props} className={className ? `${className} ${api.getErrorClass()}` : api.getErrorClass()}>
              {Array.isArray(errors) ? errors[0] : errors}
            </div>
          ) : null;
        }}
      </ContextForm.Consumer>
    )}
  </ContextApi.Consumer>
);

export default FieldError;
