import React from 'react';
import * as PropTypes from 'prop-types';
import { ContextRadioGroup } from '../FormContext';
import Helpers from '../Helpers';

const RadioGroupItem = ({ value, onBlur, ...props }) => (
  <ContextRadioGroup.Consumer>
    {({ name, getValue, setTouched, onChange }) => (
      <input
        {...props}
        name={name}
        value={Helpers.valueToJson(value)}
        checked={value === getValue(name)}
        type="radio"
        onChange={onChange}
        onBlur={event => {
          event.persist();
          setTouched(() => {
            if (onBlur) {
              onBlur(event);
            }
          });
        }}
      />
    )}
  </ContextRadioGroup.Consumer>
);

RadioGroupItem.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onBlur: PropTypes.func,
};

RadioGroupItem.defaultProps = {
  onBlur: undefined,
};

export default RadioGroupItem;
