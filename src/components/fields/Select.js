import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';

class Select extends Component {
  static propTypes = {
    getValue: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    setTouched: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      disabled: PropTypes.bool,
    })).isRequired,
  };

  render() {
    const {
      getValue,
      setValue,
      setTouched,
      options,
      onBlur,
      onChange,
      ...props
    } = this.props;

    return (
      <select
        {...props}
        value={getValue()}
        onChange={event => {
          setValue(event.target.value, () => {
            if (onChange) {
              onChange(event);
            }
          });
        }}
        onBlur={event => {
          setTouched(() => {
            if (onBlur) {
              onBlur(event);
            }
          });
        }}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} disabled={option.disabled}>{option.name}</option>
        ))}
      </select>
    );
  }
}

export default Field(Select);
