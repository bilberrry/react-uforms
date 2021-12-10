import React, { ReactNode } from 'react';
import { useArrField } from '../../hooks';
import { ArrFieldApiInterface, FormApiInterface } from '../../types';

type FieldArrayApiChildren = (
  items: Array<string>,
  arrFieldApi: ArrFieldApiInterface,
  formApi: FormApiInterface<unknown>,
) => ReactNode;

export interface FieldArrayProps {
  name: string;
  children: FieldArrayApiChildren;
}

const FieldArrayComponent: React.FC<FieldArrayProps> = ({ name, children }) => {
  const [items, arrFieldApi, formApi] = useArrField(name);
  return <>{children(items, arrFieldApi, formApi)}</>;
};

FieldArrayComponent.displayName = 'FieldArray';

export const FieldArray = FieldArrayComponent;
