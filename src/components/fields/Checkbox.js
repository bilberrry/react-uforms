import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';

class Checkbox extends Component {
  static propTypes = {
    getValue: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    setTouched: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]).isRequired,
    offValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
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
      onValue,
      offValue,
      ...props
    } = this.props;

    return (
      <input
        {...props}
        checked={onValue == getValue()}
        type="checkbox"
        onChange={event => {
          setValue(event.target.checked ? onValue : offValue, () => {
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
      />
    );
  }
}

export default Field(Checkbox, { hideError: true });
