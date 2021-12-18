import React, { ReactNode } from 'react';
import { useFieldValues } from '../../hooks';
import { FieldValueType } from '../../types';

type FieldValueApiChildren = (fields: Array<FieldValueType>) => ReactNode;

export interface FieldValueProps {
  names: Array<string>;
  children: FieldValueApiChildren;
}

const FieldValueComponent: React.FC<FieldValueProps> = ({ names, children }) => {
  const items = useFieldValues(names);
  return <>{children(items)}</>;
};

FieldValueComponent.displayName = 'FieldValue';

export const FieldValue = FieldValueComponent;
