import React from 'react';
import * as PropTypes from 'prop-types';
import { ContextRadioGroup } from '../FormContext';
import Field from '../Field';
import Helpers from '../Helpers';

const RadioGroup = ({ name, children, getValue, setValue, onChange, setTouched, onBlur }) => {
  const childApi = {
    name,
    getValue,
    onChange: event => {
      event.persist();
      if (!event.target.checked) {
        return;
      }
      setValue(Helpers.jsonToValue(event.target.value), () => {
        if (onChange) {
          onChange(event);
        }
      });
    },
    onBlur: event => {
      event.persist();
      setTouched(() => {
        if (onBlur) {
          onBlur(event);
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
  onBlur: PropTypes.func,
};

RadioGroup.defaultProps = {
  onChange: undefined,
  onBlur: undefined,
};

export default Field(RadioGroup);
