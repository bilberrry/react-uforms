import React from 'react';
import { valueToJson } from '../../helpers';
import { FieldValueType } from '../../types';
import { ContextRadioGroup } from './radio-group';

export interface RadioGroupItemProps extends Omit<React.HTMLProps<HTMLInputElement>, 'value' | 'name'> {
  value: FieldValueType;
}

const RadioGroupItemComponent = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(({ value, ...props }, ref) => (
  <ContextRadioGroup.Consumer>
    {(checkboxApi) => {
      if (!checkboxApi) {
        console.error('Could not found Radio Group API. Make sure <RadioGroupItem/> is in the <RadioGroup/>.');
        return null;
      }

      const { name, value: stateValue, disabled, onChange } = checkboxApi;
      return (
        <input
          {...props}
          ref={ref}
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
));

RadioGroupItemComponent.displayName = 'RadioGroupItem';

export const RadioGroupItem = RadioGroupItemComponent;
