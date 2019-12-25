import React, { Fragment, ReactNode } from 'react';
import Field, { FieldPassedProps } from '../field';

export interface CustomFieldProps {
  children: (api: FieldPassedProps) => ReactNode;
}

const CustomField: React.FC<CustomFieldProps & FieldPassedProps> = ({ children, ...props }) => (
  <Fragment>{children(props)}</Fragment>
);

export default Field(CustomField);
