import React from 'react';
import * as PropTypes from 'prop-types';
import { ContextRadioGroup } from '../FormContext';
import Helpers from '../Helpers';

const RadioGroupItem = ({ value, ...props }) => (
  <ContextRadioGroup.Consumer>
    {({ name, getValue, onChange, onBlur }) => (
      <input
        {...props}
        name={name}
        type="radio"
        onChange={onChange}
        onBlur={onBlur}
        value={Helpers.valueToJson(value)}
        checked={value === getValue(name)}
      />
    )}
  </ContextRadioGroup.Consumer>
);

RadioGroupItem.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default RadioGroupItem;
