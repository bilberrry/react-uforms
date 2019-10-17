import React from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';
import Helpers from '../Helpers';

const Select = ({ getValue, setValue, setTouched, options, onBlur, onChange, ...props }) => (
  <select
    {...props}
    value={Helpers.valueToJson(getValue())}
    onChange={event => {
      event.persist();
      const { target } = event;
      const isNull = !target.options[target.selectedIndex].hasAttribute('value');
      setValue(isNull ? null : Helpers.jsonToValue(target.value), () => {
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
  >
    {options.map(({ name, value, ...rest }) => {
      const jsonValue = Helpers.valueToJson(value);
      return (
        <option {...rest} key={jsonValue} value={jsonValue}>
          {name}
        </option>
      );
    })}
  </select>
);

Select.propTypes = {
  getValue: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  setTouched: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      disabled: PropTypes.bool,
    }),
  ).isRequired,
};

export default Field(Select);
