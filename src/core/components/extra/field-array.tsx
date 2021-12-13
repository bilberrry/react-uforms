import React, { ReactNode } from 'react';
import { useFieldArray } from '../../hooks';
import { FieldArrayApiInterface, FormApiInterface } from '../../types';

type FieldArrayApiChildren = (
  items: Array<any>,
  fieldArrayApi: FieldArrayApiInterface,
  formApi: FormApiInterface<unknown>,
) => ReactNode;

export interface FieldArrayProps {
  name: string;
  children: FieldArrayApiChildren;
}

const FieldArrayComponent: React.FC<FieldArrayProps> = ({ name, children }) => {
  const [items, fieldArrayApi, formApi] = useFieldArray(name);
  return <>{children(items, fieldArrayApi, formApi)}</>;
};

FieldArrayComponent.displayName = 'FieldArray';

export const FieldArray = FieldArrayComponent;
