import React from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';
import Helpers from '../Helpers';

const TextArea = ({ getValue, setValue, setTouched, onBlur, onChange, emptyValue, ...props }) => (
  <textarea
    {...props}
    value={Helpers.valueToString(getValue())}
    onChange={event => {
      event.persist();
      const value = event.target.value === '' ? emptyValue : event.target.value;
      setValue(value, () => {
        if (onChange) {
          onChange(event);
        }
      });
    }}
    onBlur={event => {
      event.persist();
      setTouched(() => {
        if (onBlur) {
          onBlur(event);
        }
      });
    }}
  />
);

TextArea.propTypes = {
  getValue: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  setTouched: PropTypes.func.isRequired,
  emptyValue: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

TextArea.defaultProps = {
  onChange: undefined,
  onBlur: undefined,
  emptyValue: '',
};

export default Field(TextArea);
