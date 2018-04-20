import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';

class Radio extends Component {
  static propTypes = {
    getValue: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    setTouched: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  };

  static defaultProps = {
    type: 'text',
  };

  render() {
    const {
      getValue,
      setValue,
      setTouched,
      onBlur,
      onChange,
      value,
      ...props
    } = this.props;

    return (
      <input
        {...props}
        value={value}
        checked={value === getValue()}
        type="radio"
        onChange={event => {
          if (!event.target.checked) {
            return;
          }
          setValue(event.target.value);
          if (onChange) {
            onChange(event);
          }
        }}
        onBlur={event => {
          setTouched();
          if (onBlur) {
            onBlur(event);
          }
        }}
      />
    );
  }
}

export default Field(Radio, { hideError: true });
