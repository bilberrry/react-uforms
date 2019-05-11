import React from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';

const Checkbox = ({ getValue, setValue, setTouched, onBlur, onChange, onValue, offValue, ...props }) => (
  <input
    {...props}
    checked={onValue === getValue()}
    type="checkbox"
    onChange={event => {
      event.persist();
      setValue(event.target.checked ? onValue : offValue, () => {
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

Checkbox.propTypes = {
  getValue: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  setTouched: PropTypes.func.isRequired,
  onValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
  offValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

Checkbox.defaultProps = {
  onChange: undefined,
  onBlur: undefined,
};

export default Field(Checkbox, { hideError: true });
