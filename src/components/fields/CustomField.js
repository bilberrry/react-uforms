import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';

const CustomField = ({ children, ...props }) => <Fragment>{children({ ...props })}</Fragment>;

CustomField.propTypes = {
  children: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
};

export default Field(CustomField);
