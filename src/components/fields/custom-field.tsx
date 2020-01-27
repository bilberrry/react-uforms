import React, { Fragment, ReactNode } from 'react';
import { Field, FieldPassedProps } from '../field';

export interface CustomFieldProps {
  children: (api: FieldPassedProps) => ReactNode;
}

const CustomFieldComponent: React.FC<CustomFieldProps & FieldPassedProps> = ({ children, ...props }) => (
  <Fragment>{children(props)}</Fragment>
);

export const CustomField = Field(CustomFieldComponent);
