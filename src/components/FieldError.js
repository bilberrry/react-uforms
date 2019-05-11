import React from 'react';
import PropTypes from 'prop-types';
import { ContextApi, ContextForm } from './FormContext';

const FieldError = ({ name, className, ...props }) => (
  <ContextApi.Consumer>
    {api => (
      <ContextForm.Consumer>
        {() => {
          const errors = api.getErrors(name);
          return errors && errors.length > 0 ? (
            <div {...props} className={className ? `${className} ${api.getErrorClass()}` : api.getErrorClass()}>
              {typeof errors === 'string' ? errors : errors[0]}
            </div>
          ) : null;
        }}
      </ContextForm.Consumer>
    )}
  </ContextApi.Consumer>
);

FieldError.propTypes = {
  name: PropTypes.string.isRequired,
};

export default FieldError;
