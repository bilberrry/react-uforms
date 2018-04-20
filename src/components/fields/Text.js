import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';

class Text extends Component {
  static propTypes = {
    getValue: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    setTouched: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
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
      ...props
    } = this.props;

    return (
      <input
        {...props}
        value={getValue()}
        onChange={event => {
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

export default Field(Text);
