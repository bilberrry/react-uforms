import React from 'react';
import * as PropTypes from 'prop-types';
import { ContextRadioGroup } from '../FormContext';
import Field from '../Field';
import Helpers from '../Helpers';

const RadioGroup = ({ name, children, getValue, setValue, setTouched, onChange }) => {
  const childApi = {
    name,
    getValue,
    setTouched,
    onChange: event => {
      event.persist();
      setValue(Helpers.jsonToValue(event.target.value), () => {
        if (onChange) {
          onChange(event);
        }
      });
    },
  };

  return <ContextRadioGroup.Provider value={childApi}>{children}</ContextRadioGroup.Provider>;
};

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  getValue: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  setTouched: PropTypes.func.isRequired,
  onChange: PropTypes.func,
};

RadioGroup.defaultProps = {
  onChange: undefined,
};

export default Field(RadioGroup);
