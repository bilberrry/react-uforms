import React, { PropsWithoutRef } from 'react';
import { valueToJson } from '../../helpers';
import { FieldRefProp, FieldValueType } from '../../types';
import { ContextRadioGroup } from './radio-group';

export interface RadioGroupItemProps extends Omit<React.HTMLProps<HTMLInputElement>, 'value' | 'name'> {
  value: FieldValueType;
}

const RadioGroupItemComponent = ({
  value,
  uRef,
  ...props
}: PropsWithoutRef<RadioGroupItemProps & FieldRefProp<HTMLInputElement>>) => (
  <ContextRadioGroup.Consumer>
    {(checkboxApi) => {
      if (!checkboxApi) {
        console.error('Could not find Radio Group API. Make sure <RadioGroupItem/> is in the <RadioGroup/>.');
        return null;
      }

      const { name, value: stateValue, disabled, onChange } = checkboxApi;
      return (
        <input
          {...props}
          ref={uRef}
          name={name}
          value={valueToJson(value)}
          checked={value === stateValue}
          type="radio"
          onChange={onChange}
          disabled={disabled}
        />
      );
    }}
  </ContextRadioGroup.Consumer>
);

RadioGroupItemComponent.displayName = 'RadioGroupItem';

export const RadioGroupItem = RadioGroupItemComponent;
