import React, { PropsWithRef, ReactElement, ReactNode } from 'react';
import { useFieldArray } from '../../hooks';
import { FieldArrayApiInterface, FormApiInterface, FormValues } from '../../types';

type FieldArrayApiChildren<Values extends FormValues> = (
  items: Array<any>,
  fieldArrayApi: FieldArrayApiInterface,
  formApi: FormApiInterface<Values>,
) => ReactNode;

export interface FieldArrayProps<Values extends FormValues> {
  name: string;
  children: FieldArrayApiChildren<Values>;
}

const FieldArrayComponent = <Values extends FormValues>({
  name,
  children,
}: PropsWithRef<FieldArrayProps<Values>>): ReactElement | null => {
  const [items, fieldArrayApi, formApi] = useFieldArray<Values>(name);
  return <>{children(items, fieldArrayApi, formApi)}</>;
};

FieldArrayComponent.displayName = 'FieldArray';

export const FieldArray = FieldArrayComponent;
