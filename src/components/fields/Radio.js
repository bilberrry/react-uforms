import React from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';
import Helpers from '../Helpers';

const Radio = ({ getValue, setValue, setTouched, onBlur, onChange, value, ...props }) => (
  <input
    {...props}
    value={Helpers.valueToJson(getValue())}
    checked={value === getValue()}
    type="radio"
    onChange={event => {
      event.persist();
      if (!event.target.checked) {
        if (onChange) {
          onChange(event);
        }
      } else {
        setValue(value, () => {
          if (onChange) {
            onChange(event);
          }
        });
      }
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

Radio.propTypes = {
  getValue: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  setTouched: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

Radio.defaultProps = {
  onChange: undefined,
  onBlur: undefined,
};

export default Field(Radio, { hideError: true });
