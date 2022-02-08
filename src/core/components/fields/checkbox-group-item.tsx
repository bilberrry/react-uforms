import React, { PropsWithoutRef } from 'react';
import { valueToJson } from '../../helpers';
import { FieldRefProp, FieldValueType } from '../../types';
import { ContextCheckboxGroup } from './checkbox-group';

export interface CheckboxGroupItemProps extends Omit<React.HTMLProps<HTMLInputElement>, 'value' | 'name'> {
  value: FieldValueType;
}

const CheckboxGroupItemComponent = ({
  value,
  uRef,
  ...props
}: PropsWithoutRef<CheckboxGroupItemProps & FieldRefProp<HTMLInputElement>>) => (
  <ContextCheckboxGroup.Consumer>
    {(checkboxApi) => {
      if (!checkboxApi) {
        console.error('Could not find Checkbox Group API. Make sure <CheckboxGroupItem/> is in the <CheckboxGroup/>.');
        return null;
      }

      const { name, value: stateValue, disabled, onChange } = checkboxApi;
      const arrValue = stateValue || [];
      return (
        <input
          {...props}
          ref={uRef}
          name={name}
          value={valueToJson(value)}
          checked={arrValue.length > 0 && arrValue.includes(value)}
          type="checkbox"
          onChange={onChange}
          disabled={disabled}
        />
      );
    }}
  </ContextCheckboxGroup.Consumer>
);

CheckboxGroupItemComponent.displayName = 'CheckboxGroupItem';

export const CheckboxGroupItem = CheckboxGroupItemComponent;
